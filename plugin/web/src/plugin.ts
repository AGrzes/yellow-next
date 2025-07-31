import { PluginContext } from '@agrzes/yellow-next-plugin-core'
import { Router, ROUTER } from '@agrzes/yellow-next-plugin-server'
import { join } from 'path'
import { createServer } from 'vite'
import { VITE_ROUTER } from './index.js'
function entrypoint({ manifest, registry }: PluginContext): void {
  registry.register({
    identifier: VITE_ROUTER,
    dependencies: [],
    factory: async ([]) => {
      const router = Router()
      const vite = await createServer({
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
