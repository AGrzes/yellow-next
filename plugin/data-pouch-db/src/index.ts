import { ServiceIdentifier } from '@agrzes/yellow-next-plugin-core'
import type PouchDB = require('pouchdb-node')

export interface Catalog {
  list(): string[]
  get<T>(name: string): PouchDB.Database<T>
}

export const POUCHDB_CATALOG: ServiceIdentifier<Catalog> = 'data-pouch-db.catalog'
