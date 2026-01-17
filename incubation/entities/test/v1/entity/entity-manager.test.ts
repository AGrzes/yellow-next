import { describe, expect, it, vi } from 'vitest'
import type { DocumentStore } from '../../../src/v1/document-store'
import { EntityManagerImpl, type Entity } from '../../../src/v1/entity'
import type { EntityTypeID } from '../../../src/v1/schema/schema-manager'

type StoredDoc<Body> = { key: string[]; body: Body; revision?: string }

const makeStore = <Body>(docs: StoredDoc<Body>[]) => {
  const store = {
    get: vi.fn(async (key: string[]) => {
      const doc = docs.find((entry) => entry.key.join('/') === key.join('/'))
      return doc ?? null
    }),
    list: vi.fn(async (prefix: string[]) => {
      return docs.filter((entry) => entry.key.slice(0, prefix.length).join('/') === prefix.join('/'))
    }),
    merge: vi.fn(async () => undefined),
  } as unknown as DocumentStore<string>

  return store
}

describe('EntityManagerImpl', () => {
  it('gets an entity by type and id', async () => {
    const type = 'book' as EntityTypeID
    const store = makeStore([{ key: ['entities', type, '1'], body: { title: 'Dune' } }])
    const manager = new EntityManagerImpl(store)

    const entity = await manager.get<{ title: string }>(type, '1')

    expect(entity).toEqual({ type, id: '1', body: { title: 'Dune' } })
    expect(store.get).toHaveBeenCalledWith(['entities', type, '1'])
  })

  it('returns null when entity is missing', async () => {
    const type = 'book' as EntityTypeID
    const store = makeStore([])
    const manager = new EntityManagerImpl(store)

    const entity = await manager.get(type, 'missing')

    expect(entity).toBeNull()
  })

  it('lists entities for a type', async () => {
    const type = 'book' as EntityTypeID
    const store = makeStore([
      { key: ['entities', type, '1'], body: { title: 'Dune' } },
      { key: ['entities', type, '2'], body: { title: 'Neuromancer' } },
      { key: ['entities', 'movie', '1'], body: { title: 'Alien' } },
    ])
    const manager = new EntityManagerImpl(store)

    const entities = await manager.list<{ title: string }>(type)

    expect(entities).toEqual([
      { type, id: '1', body: { title: 'Dune' } },
      { type, id: '2', body: { title: 'Neuromancer' } },
    ])
    expect(store.list).toHaveBeenCalledWith(['entities', type])
  })

  it('saves an entity to the document store', async () => {
    const type = 'book' as EntityTypeID
    const store = makeStore([])
    const manager = new EntityManagerImpl(store)
    const entity: Entity<{ title: string }> = { type, id: '1', body: { title: 'Dune' } }

    await manager.save(entity)

    expect(store.merge).toHaveBeenCalledWith(
      { key: ['entities', type, '1'], body: { title: 'Dune' } },
      expect.any(Function)
    )
  })

  it('uses a deep merge strategy when saving entities', async () => {
    const type = 'book' as EntityTypeID
    const store = makeStore([])
    const manager = new EntityManagerImpl(store)
    const entity: Entity<{ meta: { a?: number; b?: number } }> = { type, id: '1', body: { meta: { b: 2 } } }

    await manager.save(entity)

    const mergeFn = (store.merge as any).mock.calls[0][1] as (next: any, current: any) => any
    const merged = mergeFn({ meta: { b: 2 } }, { meta: { a: 1 } })

    expect(merged).toEqual({ meta: { a: 1, b: 2 } })
  })

  it('throws for unimplemented find/findOne', async () => {
    const type = 'book' as EntityTypeID
    const store = makeStore([])
    const manager = new EntityManagerImpl(store)

    await expect(manager.findOne(type, { title: 'Dune' })).rejects.toThrow('Method not implemented.')
    await expect(manager.find(type, { title: 'Dune' })).rejects.toThrow('Method not implemented.')
  })
})
