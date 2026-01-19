import PouchDB from 'pouchdb'
import PouchDBAdapterMemory from 'pouchdb-adapter-memory'
import { PouchDBStore } from '../../src/v1/document-store/pouchdb-store'
import { EntityManager, EntityManagerImpl } from '../../src/v1/entity'
import { Collection, Collections } from './types.ts'

PouchDB.plugin(PouchDBAdapterMemory)

async function insertItem(database: PouchDB.Database, type: string, id: string, body: any) {
  await database.put({
    _id: `entities/${type}/${id}`,
    body,
  })
}

async function insertCollection(database: PouchDB.Database, collection: Collection) {
  for (const item of collection.items) {
    const { id, ...body } = item
    await insertItem(database, collection.type, id, body)
  }
}

export async function setupEntityManager(collections: Collections): Promise<EntityManager> {
  const db = new PouchDB('entities-test-db', { adapter: 'memory' })
  const store = new PouchDBStore(db)
  const entityManager = new EntityManagerImpl(store)
  for (const entity of Object.values(collections)) {
    await insertCollection(db, entity)
  }
  return entityManager
}
