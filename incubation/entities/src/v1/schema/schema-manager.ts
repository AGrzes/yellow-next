import { type JsonSchema7 } from '@jsonforms/core'
import type { Change, DocumentStore } from '../document-store/index.ts'

export type EntityTypeID = string

export interface SchemaExtensions {}
declare module '@jsonforms/core' {
  interface JsonSchema7 {
    entity?: boolean
    extensions?: SchemaExtensions
  }
  interface JsonSchema4 {
    entity?: boolean
    extensions?: SchemaExtensions
  }
}

export interface Type {
  parent?: Type
  ancestors: Type[]
  descendants?: Type[]
  name: string
  schema: JsonSchema7
}

export interface SerializedType {
  name: EntityTypeID
  schema: JsonSchema7
  parent?: EntityTypeID
}

class SchemaCache {
  typesByName = new Map<string, Type>()
}

function computeAncestors(type: Type): Type[] {
  const ancestors: Type[] = []
  let current = type.parent
  while (current) {
    ancestors.push(current)
    current = current.parent
  }
  return ancestors
}

async function buildSchemaCache(store: DocumentStore<any>): Promise<SchemaCache> {
  const cache = new SchemaCache()
  const typeDocuments = await store.list<SerializedType>(['types'])

  for (const doc of typeDocuments) {
    const serializedType = doc.body
    const type: Type = {
      name: serializedType.name,
      schema: serializedType.schema,
      ancestors: [],
    }
    cache.typesByName.set(serializedType.name, type)
  }
  for (const doc of typeDocuments) {
    const parent = cache.typesByName.get(doc.body.parent!)
    if (parent) {
      const type = cache.typesByName.get(doc.body.name)!
      type.parent = parent
    }
  }
  for (const type of cache.typesByName.values()) {
    if (type.parent) {
      type.ancestors = computeAncestors(type)
      type.ancestors.forEach((ancestor) => {
        ancestor.descendants = ancestor.descendants || []
        ancestor.descendants.push(type)
      })
    }
  }
  return cache
}

export class SchemaManager {
  private cache?: Promise<SchemaCache>

  private async onDocumentStoreChange(change: Change<SerializedType, any>): Promise<void> {
    if (change.key[0] === 'types') {
      this.cache = undefined
    }
  }

  constructor(private readonly store: DocumentStore<any>) {
    this.store.subscribe<SerializedType>(this.onDocumentStoreChange.bind(this))
  }

  async get(name: string): Promise<Type | undefined> {
    if (!this.cache) {
      this.cache = buildSchemaCache(this.store)
    }
    const cache = await this.cache
    return cache.typesByName.get(name)
  }
  async list(): Promise<Type[]> {
    if (!this.cache) {
      this.cache = buildSchemaCache(this.store)
    }
    const cache = await this.cache
    return Array.from(cache.typesByName.values())
  }
}
