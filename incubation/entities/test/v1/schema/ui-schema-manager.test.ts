import { describe, expect, it, vi } from 'vitest'
import type { Change, ChangeListener, Document, DocumentStore } from '../../../src/v1/document-store'
import { UiSchemaManager, type UiSchemaEntry } from '../../../src/v1/schema/ui-schema-manager'
import type { EntityTypeID } from '../../../src/v1/schema/schema-manager'
import type { UISchemaElement } from '@jsonforms/core'

type Revision = void

type StoredDoc = Document<UiSchemaEntry, Revision>

type SchemaNode = { name: EntityTypeID; ancestors?: Array<{ name: EntityTypeID }> }

const makeStore = (docs: StoredDoc[]) => {
  const listeners = new Set<ChangeListener<UiSchemaEntry, Revision>>()
  const store = {
    list: vi.fn(async () => docs),
    subscribe: vi.fn((onChange: ChangeListener<UiSchemaEntry, Revision>) => {
      listeners.add(onChange)
      return { unsubscribe: () => listeners.delete(onChange) }
    }),
  } as unknown as DocumentStore<Revision>

  const emit = (change: Change<UiSchemaEntry, Revision>) => {
    for (const listener of listeners) {
      void listener(change)
    }
  }

  return { store, emit }
}

const makeSchemaManager = (map: Record<string, SchemaNode>) => ({
  get: vi.fn(async (type: EntityTypeID) => map[type]),
})

describe('UiSchemaManager', () => {
  it('returns the exact schema for type and variant', async () => {
    const element = { type: 'VerticalLayout' } as UISchemaElement
    const { store } = makeStore([
      { key: ['ui-schemas', 'book'], body: { type: 'book', variant: 'compact', element } },
    ])
    const schemaManager = makeSchemaManager({ book: { name: 'book' } })
    const manager = new UiSchemaManager(store, schemaManager as any)

    const result = await manager.get('book', 'compact')

    expect(result).toBe(element)
  })

  it('falls back to ancestor variants', async () => {
    const parentElement = { type: 'VerticalLayout' } as UISchemaElement
    const { store } = makeStore([
      { key: ['ui-schemas', 'base'], body: { type: 'base', variant: 'default', element: parentElement } },
    ])
    const schemaManager = makeSchemaManager({
      book: { name: 'book', ancestors: [{ name: 'base' }] },
      base: { name: 'base' },
    })
    const manager = new UiSchemaManager(store, schemaManager as any)

    const result = await manager.get('book', 'default')

    expect(result).toBe(parentElement)
  })

  it('falls back to default variant when variant is missing', async () => {
    const element = { type: 'HorizontalLayout' } as UISchemaElement
    const { store } = makeStore([
      { key: ['ui-schemas', 'book'], body: { type: 'book', variant: 'default', element } },
    ])
    const schemaManager = makeSchemaManager({ book: { name: 'book' } })
    const manager = new UiSchemaManager(store, schemaManager as any)

    const result = await manager.get('book', 'compact')

    expect(result).toBe(element)
  })

  it('returns undefined when no schema exists', async () => {
    const { store } = makeStore([])
    const schemaManager = makeSchemaManager({ book: { name: 'book' } })
    const manager = new UiSchemaManager(store, schemaManager as any)

    const result = await manager.get('book', 'default')

    expect(result).toBeUndefined()
  })

  it('returns undefined when variant is missing and no default exists', async () => {
    const { store } = makeStore([])
    const schemaManager = makeSchemaManager({ book: { name: 'book' } })
    const manager = new UiSchemaManager(store, schemaManager as any)

    const result = await manager.get('book', 'compact')

    expect(result).toBeUndefined()
  })

  it('rebuilds cache on ui-schemas changes', async () => {
    const firstElement = { type: 'VerticalLayout' } as UISchemaElement
    const secondElement = { type: 'HorizontalLayout' } as UISchemaElement
    const { store, emit } = makeStore([
      { key: ['ui-schemas', 'book'], body: { type: 'book', variant: 'default', element: firstElement } },
    ])
    const schemaManager = makeSchemaManager({ book: { name: 'book' } })
    const manager = new UiSchemaManager(store, schemaManager as any)

    const first = await manager.get('book', 'default')
    expect(first).toBe(firstElement)

    store.list = vi.fn(async () => [
      { key: ['ui-schemas', 'book'], body: { type: 'book', variant: 'default', element: secondElement } },
    ]) as any
    emit({ type: 'update', key: ['ui-schemas', 'book'], body: { type: 'book', variant: 'default', element: secondElement } })

    const second = await manager.get('book', 'default')
    expect(second).toBe(secondElement)
  })

  it('keeps cache when change is outside ui-schemas', async () => {
    const element = { type: 'VerticalLayout' } as UISchemaElement
    const { store, emit } = makeStore([
      { key: ['ui-schemas', 'book'], body: { type: 'book', variant: 'default', element } },
    ])
    const schemaManager = makeSchemaManager({ book: { name: 'book' } })
    const manager = new UiSchemaManager(store, schemaManager as any)

    const first = await manager.get('book', 'default')
    expect(first).toBe(element)

    store.list = vi.fn(async () => []) as any
    emit({ type: 'update', key: ['types', 'book'], body: { type: 'book', variant: 'default', element } })

    const second = await manager.get('book', 'default')
    expect(second).toBe(element)
  })
})
