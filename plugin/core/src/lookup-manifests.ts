import debug from 'debug'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { PluginManifest } from './manifest.js'
const log = debug('yellow:plugin:core:lookup-manifests')

export function makeLookupManifest(
  requirePaths: (module: string) => string[],
  glob: (source: string[]) => Promise<string[]>,
  readFile: typeof import('node:fs/promises').readFile
) {
  return async function lookupManifest(): Promise<PluginManifest[]> {
    const require = createRequire(import.meta.url)
    const paths = await glob(
      requirePaths('*').flatMap((p) => [join(p, '*', 'yellow-plugin.json'), join(p, '@*', '*', 'yellow-plugin.json')])
    )
    const manifests = await Promise.all(
      paths.map(async (path) => {
        try {
          const base = dirname(path)
          const manifest = JSON.parse(await readFile(path, 'utf-8'))
          manifest.base = manifest.base || base
          return [manifest as PluginManifest]
        } catch (e) {
          log(`Failed to load plugin manifest at ${path}:`, e)
          return []
        }
      })
    )
    return manifests.flat()
  }
}
