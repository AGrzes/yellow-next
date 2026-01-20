import { DocumentStore } from '../../src/v1/document-store/index'
import { MemoryStore } from '../../src/v1/document-store/memory-store'
import { EntityManager, EntityManagerImpl } from '../../src/v1/entity'
import { EntitySchemaHandler } from '../../src/v1/entity/entity-schema'
import { SchemaManager, type SerializedType } from '../../src/v1/schema/schema-manager'
import { Collection, Collections } from './types.ts'

async function insertItem(store: DocumentStore, type: string, id: string, body: any) {
  await store.merge(
    {
      key: [`entities`, type, id],
      body,
    },
    (current, incoming) => current
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

export async function setupEntityManager(
  collections: Collections,
  schemas: SerializedType[]
): Promise<EntityManager> {
  const store = new MemoryStore()
  const schemaManager = new SchemaManager(store)
  const schemaHandler = new EntitySchemaHandler(schemaManager)
  const entityManager = new EntityManagerImpl(store, schemaHandler)
  await insertSchemas(store, schemas)
  for (const entity of Object.values(collections)) {
    await insertCollection(store, entity)
  }
  return entityManager
}
