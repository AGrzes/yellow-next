import { type JsonSchema7 } from '@jsonforms/core'
import type { Change, DocumentStore } from '../document-store/index.ts'

export interface SchemaExtensions {}

export interface ExtendedSchema extends JsonSchema7 {
  extensions: SchemaExtensions
  additionalItems?: boolean | ExtendedSchema
  items?: ExtendedSchema | ExtendedSchema[]
  additionalProperties?: boolean | ExtendedSchema
  definitions?: { [key: string]: ExtendedSchema }
  properties?: { [property: string]: ExtendedSchema }
  patternProperties?: { [pattern: string]: ExtendedSchema }
  dependencies?: { [key: string]: ExtendedSchema | string[] }
  allOf?: ExtendedSchema[]
  anyOf?: ExtendedSchema[]
  oneOf?: ExtendedSchema[]
  not?: ExtendedSchema
  contains?: ExtendedSchema
  propertyNames?: ExtendedSchema
  if?: ExtendedSchema
  then?: ExtendedSchema
  else?: ExtendedSchema
}

export interface Type {
  parent?: Type
  ancestors: Type[]
  descendants?: Type[]
  name: string
  schema: ExtendedSchema
}

export interface SerializedType {
  name: string
  schema: ExtendedSchema
  parent?: string
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
