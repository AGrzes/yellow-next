import {
  factoryForConstructor,
  PluginContext,
  ServiceIdentifier,
  ServiceRequest,
} from '@agrzes/yellow-next-plugin-core'
import PouchDB from 'pouchdb-node'
import { PouchDBFactory, StaticCatalog } from './catalog.js'
import { POUCHDB_CATALOG, POUCHDB_CONFIG } from './index.js'

export const POUCHDB_FACTORY: ServiceIdentifier<PouchDBFactory> = 'data-pouch-db.factory'

function entrypoint({ manifest, registry }: PluginContext): void {
  registry.register({
    identifier: POUCHDB_FACTORY,
    dependencies: [],
    factory: factoryForConstructor(PouchDB),
  })

  registry.register({
    identifier: POUCHDB_CATALOG,
    dependencies: [POUCHDB_FACTORY, ServiceRequest.multiple(POUCHDB_CONFIG)],
    async factory([factory, config]) {
      return new StaticCatalog(factory, config)
    },
  })
}

export default entrypoint
