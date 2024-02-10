import { interfaces } from 'inversify'
import PouchDB from 'pouchdb'
import pouchDbAdapterMemory from 'pouchdb-adapter-memory'

PouchDB.plugin(pouchDbAdapterMemory)

export type DocumentStore = InstanceType<PouchDB.Static>
export const DocumentStore: interfaces.ServiceIdentifier<PouchDB.Database> = PouchDB

export const documentStoreFactory: interfaces.SimpleFactory<DocumentStore, [string]> = function (instance: string) {
  return new PouchDB(instance, { adapter: 'memory' })
}
