import { PluginContext, ServiceIdentifier, ServiceRequest } from '@agrzes/yellow-next-plugin-core'
import { ROUTER, ROUTER_FACTORY } from '@agrzes/yellow-next-plugin-server'
import { join } from 'path'
import { createServer } from 'vite'
import { VITE_ROUTER, WebEntrypoint } from './index.js'
import { injectWebEntrypoints } from './inject-web-entrypoints.js'
import { resolveBareFromImporter } from './resolve-bare-from-importer.js'

export const VITE_SERVER_FACTORY: ServiceIdentifier<typeof createServer> = 'vite.server.factory'
function entrypoint({ manifest, registry }: PluginContext): void {
  registry.register({
    identifier: VITE_SERVER_FACTORY,
    dependencies: [],
    factory: async ([]) => createServer,
  })

  registry.register({
    identifier: VITE_ROUTER,
    dependencies: [VITE_SERVER_FACTORY, ROUTER_FACTORY, ServiceRequest.multiple(WebEntrypoint)],
    factory: async ([viteServerFactory, routerFactory, entrypoints]) => {
      const router = routerFactory()
      const vite = await viteServerFactory({
        plugins: [resolveBareFromImporter(), injectWebEntrypoints(entrypoints)],
        root: join(manifest.base, 'web'),
        server: {
          middlewareMode: true,
        },
      })
      router.use(vite.middlewares)
      return router
    },
    provided: [ROUTER],
  })
}

export default entrypoint
