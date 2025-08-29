import { PluginContext, ServiceIdentifier, ServiceRequest } from '@agrzes/yellow-next-plugin-core'
import PouchDB from 'pouchdb-node'
import { PouchDBFactory, StaticCatalog } from './catalog.js'
import { POUCHDB_CATALOG, POUCHDB_CONFIG } from './index.js'

export const POUCHDB_FACTORY: ServiceIdentifier<PouchDBFactory> = 'data-pouch-db.factory'

export function factoryFromConstructor<C extends new (...args: any) => any>(Ctor: C) {
  type A = ConstructorParameters<C>
  type I = InstanceType<C>
  return () =>
    (...args: A): I =>
      new Ctor(...args)
}

function entrypoint({ manifest, registry }: PluginContext): void {
  registry.register({
    identifier: POUCHDB_FACTORY,
    dependencies: [],
    factory: factoryFromConstructor(PouchDB),
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
