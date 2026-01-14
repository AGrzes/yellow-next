import { describe, expect, it, vi } from 'vitest'
import type { Change, ChangeListener, Document, DocumentStore } from '../../../src/v1/document-store'
import { SchemaManager, type ExtendedSchema, type SerializedType } from '../../../src/v1/schema/schema-manager'

type Revision = void

type StoredDoc = Document<SerializedType, Revision>

const schema = (): ExtendedSchema => ({})
const createStore = (listImpl: () => Promise<StoredDoc[]>) => {
  const listeners = new Set<ChangeListener<SerializedType, Revision>>()

  const store = {
    list: vi.fn(listImpl),
    subscribe: vi.fn((onChange: ChangeListener<SerializedType, Revision>) => {
      listeners.add(onChange)
      return {
        unsubscribe: () => listeners.delete(onChange),
      }
    }),
  } as unknown as DocumentStore<Revision>

  const emit = (change: Change<SerializedType, Revision>) => {
    for (const listener of listeners) {
      void listener(change)
    }
  }

  return { store, emit }
}

describe('SchemaManager', () => {
  it('builds parent/ancestor/descendant links', async () => {
    const docs: StoredDoc[] = [
      { key: ['types', 'animal'], body: { name: 'animal', schema: schema() } },
      { key: ['types', 'dog'], body: { name: 'dog', schema: schema(), parent: 'animal' } },
      { key: ['types', 'poodle'], body: { name: 'poodle', schema: schema(), parent: 'dog' } },
      { key: ['types', 'cat'], body: { name: 'cat', schema: schema(), parent: 'animal' } },
      { key: ['types', 'tiger'], body: { name: 'tiger', schema: schema(), parent: 'cat' } },
    ]
    const { store } = createStore(async () => docs)
    const manager = new SchemaManager(store)

    const dog = await manager.get('dog')
    const animal = await manager.get('animal')
    const poodle = await manager.get('poodle')
    const cat = await manager.get('cat')
    const tiger = await manager.get('tiger')

    expect(dog?.parent?.name).toBe('animal')
    expect(dog?.ancestors.map((type) => type.name)).toEqual(['animal'])
    expect(poodle?.ancestors.map((type) => type.name)).toEqual(['dog', 'animal'])
    expect(cat?.ancestors.map((type) => type.name)).toEqual(['animal'])
    expect(tiger?.ancestors.map((type) => type.name)).toEqual(['cat', 'animal'])
    expect(dog?.descendants?.map((type) => type.name)).toEqual(['poodle'])
    expect(cat?.descendants?.map((type) => type.name)).toEqual(['tiger'])
    expect(animal?.descendants?.map((type) => type.name).sort()).toEqual(['cat', 'dog', 'poodle', 'tiger'])
  })

  it('rebuilds cache after change', async () => {
    const firstDocs: StoredDoc[] = [{ key: ['types', 'a'], body: { name: 'a', schema: schema() } }]
    const secondDocs: StoredDoc[] = [{ key: ['types', 'b'], body: { name: 'b', schema: schema() } }]
    const { store, emit } = createStore(vi.fn())
    store.list = vi.fn().mockResolvedValueOnce(firstDocs).mockResolvedValueOnce(secondDocs)
    const manager = new SchemaManager(store)

    const first = await manager.list()
    expect(first.map((type) => type.name)).toEqual(['a'])

    emit({ type: 'update', key: ['types', 'b'], body: { name: 'b', schema: schema() } })

    const second = await manager.list()
    expect(second.map((type) => type.name)).toEqual(['b'])
  })

  it('reuses cache until a types change happens', async () => {
    const docs: StoredDoc[] = [{ key: ['types', 'a'], body: { name: 'a', schema: schema() } }]
    const { store, emit } = createStore(vi.fn())
    store.list = vi.fn().mockResolvedValue(docs)
    const manager = new SchemaManager(store)

    const first = await manager.list()
    const second = await manager.list()

    expect(first.map((type) => type.name)).toEqual(['a'])
    expect(second.map((type) => type.name)).toEqual(['a'])

    emit({ type: 'update', key: ['other'], body: { name: 'b', schema: schema() } })

    const third = await manager.list()
    expect(third.map((type) => type.name)).toEqual(['a'])
  })
})
