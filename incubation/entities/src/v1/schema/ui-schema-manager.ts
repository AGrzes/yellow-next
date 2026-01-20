import { type UISchemaElement } from '@jsonforms/core'
import type { Change, DocumentStore } from '../document-store/index.ts'
import type { EntityTypeID, SchemaManager } from './schema-manager.ts'

export type UiSchemaVariant = 'default' | string

export interface UiSchemaEntry {
  element: UISchemaElement
  variant: UiSchemaVariant
  type: EntityTypeID
}

class UiSchemaCache {
  private uiSchemaByTypeAndVariant = new Map<string, Map<string, UISchemaElement>>()

  constructor(entries: UiSchemaEntry[]) {
    for (const entry of entries) {
      this.uiSchemaByTypeAndVariant.set(
        entry.type,
        this.uiSchemaByTypeAndVariant.get(entry.type) || new Map<string, UISchemaElement>()
      )
      this.uiSchemaByTypeAndVariant.get(entry.type)!.set(entry.variant, entry.element)
    }
  }

  get(type: EntityTypeID, variant: UiSchemaVariant): UISchemaElement | undefined {
    return this.uiSchemaByTypeAndVariant.get(type)?.get(variant)
  }
}

async function buildUiSchemaCache(store: DocumentStore<any>): Promise<UiSchemaCache> {
  const entries = await store.list<UiSchemaEntry>(['types'])
  return new UiSchemaCache(entries.map((doc) => doc.body))
}

export class UiSchemaManager {
  private cache?: Promise<UiSchemaCache>

  private async onDocumentStoreChange(change: Change<UiSchemaEntry, any>): Promise<void> {
    if (change.key[0] === 'ui-schemas') {
      this.cache = undefined
    }
  }

  constructor(private readonly store: DocumentStore<any>, private readonly schemaManager: SchemaManager) {
    this.store.subscribe<UiSchemaEntry>(this.onDocumentStoreChange.bind(this))
  }

  async get(type: EntityTypeID, variant: UiSchemaVariant = 'default'): Promise<UISchemaElement | undefined> {
    if (!this.cache) {
      this.cache = buildUiSchemaCache(this.store)
    }
    const cache = await this.cache
    const ancestors = (await this.schemaManager.get(type))?.ancestors?.map(({ name }) => name) || []
    for (const ancestor of [type, ...ancestors]) {
      const uiSchema = cache.get(ancestor, variant)
      if (uiSchema) {
        return uiSchema
      }
    }
    if (variant !== 'default') {
      for (const ancestor of [type, ...ancestors]) {
        const uiSchema = cache.get(ancestor, 'default')
        if (uiSchema) {
          return uiSchema
        }
      }
    }
  }
}
