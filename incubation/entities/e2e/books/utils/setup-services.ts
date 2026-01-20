import type { Collection, Collections } from '@e2e/books/utils/types'
import type { DocumentStore } from '@v1/document-store'
import { MemoryStore } from '@v1/document-store/memory-store'
import { EntityManagerImpl, type EntityManager } from '@v1/entity'
import { EntitySchemaHandler } from '@v1/entity/entity-schema'
import { SchemaManager, type SerializedType } from '@v1/schema/schema-manager'
import { UiSchemaManager, type UiSchemaEntry } from '@v1/schema/ui-schema-manager'

async function insertItem(store: DocumentStore, type: string, id: string, body: any) {
  await store.merge(
    {
      key: [`entities`, type, id],
      body,
    },
    (current, _incoming) => current
  )
}

async function insertCollection(store: DocumentStore, collection: Collection) {
  for (const item of collection.items) {
    const { id, ...body } = item
    await insertItem(store, collection.type, id, body)
  }
}

async function insertSchemas(store: DocumentStore, schemas: SerializedType[]) {
  for (const schema of schemas) {
    await store.merge(
      {
        key: ['types', schema.name],
        body: schema,
      },
      (next) => next
    )
  }
}

async function insertUiSchemas(store: DocumentStore, uiSchemas: UiSchemaEntry[]) {
  for (const uiSchema of uiSchemas) {
    const key = ['ui-schemas', `${uiSchema.type}:${uiSchema.variant}`]
    await store.merge(
      {
        key,
        body: uiSchema,
      },
      (next) => next
    )
  }
}

export async function setupServices(
  collections: Collections,
  schemas: SerializedType[],
  uiSchemas: UiSchemaEntry[]
): Promise<{ entityManager: EntityManager; uiSchemaManager: UiSchemaManager }> {
  const store = new MemoryStore()
  const schemaManager = new SchemaManager(store)
  const schemaHandler = new EntitySchemaHandler(schemaManager)
  const entityManager = new EntityManagerImpl(store, schemaHandler)
  const uiSchemaManager = new UiSchemaManager(store, schemaManager)
  await insertSchemas(store, schemas)
  for (const entity of Object.values(collections)) {
    await insertCollection(store, entity)
  }
  await insertUiSchemas(store, uiSchemas)
  return { entityManager, uiSchemaManager }
}
