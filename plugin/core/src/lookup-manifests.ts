import debug from 'debug'
import { dirname, join } from 'node:path'
import { PluginManifest } from './manifest.js'
const log = debug('yellow:plugin:core:lookup-manifests')

export function makeLookupManifests(
  requirePaths: (module: string) => string[],
  glob: (source: string[]) => Promise<string[]>,
  readFile: typeof import('node:fs/promises').readFile
) {
  return async function lookupManifests(): Promise<PluginManifest[]> {
    const lookupPaths = requirePaths('*')
    log('Looking up plugin manifests in paths:', lookupPaths)
    if (process.env.YELLOW_PLUGIN_DIR) {
      log('Using custom plugin directory from environment:', process.env.YELLOW_PLUGIN_DIR)
      lookupPaths.push(...process.env.YELLOW_PLUGIN_DIR.split(','))
    }
    log('Final lookup paths:', lookupPaths)
    const paths = await glob(
      lookupPaths.flatMap((p) => [join(p, '*', 'yellow-plugin.json'), join(p, '@*', '*', 'yellow-plugin.json')])
    )
    log('Found plugin manifest paths:', paths)
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
