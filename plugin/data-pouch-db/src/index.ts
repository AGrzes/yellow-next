import { ServiceIdentifier } from '@agrzes/yellow-next-plugin-core'
import { Catalog, PouchDbConfig } from './catalog.js'

export const POUCHDB_CATALOG: ServiceIdentifier<Catalog> = 'data-pouch-db.catalog'
export const POUCHDB_CONFIG: ServiceIdentifier<PouchDbConfig> = 'data-pouch-db.config'