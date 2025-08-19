import { PluginContext, ServiceIdentifier } from '@agrzes/yellow-next-plugin-core'
import { WebEntrypoint } from '@agrzes/yellow-next-plugin-web'
import { resolve } from 'path'
import { createServer } from 'vite'

export const VITE_SERVER_FACTORY: ServiceIdentifier<typeof createServer> = 'vite.server.factory'
function entrypoint({ manifest, registry }: PluginContext): void {
  registry.register({
    identifier: WebEntrypoint,
    dependencies: [],
    factory: async ([]) => ({ root: manifest.base, script: resolve(manifest.base, 'web', 'index.ts') }),
  })
}

export default entrypoint
