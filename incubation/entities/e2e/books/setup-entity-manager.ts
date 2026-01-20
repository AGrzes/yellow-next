import { DocumentStore } from '../../src/v1/document-store/index'
import { MemoryStore } from '../../src/v1/document-store/memory-store'
import { EntityManager, EntityManagerImpl } from '../../src/v1/entity'
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

export async function setupEntityManager(collections: Collections): Promise<EntityManager> {
  const store = new MemoryStore()
  const entityManager = new EntityManagerImpl(store)
  for (const entity of Object.values(collections)) {
    await insertCollection(store, entity)
  }
  return entityManager
}
