import debug from 'debug'
import fg from 'fast-glob'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const log = debug('yellow:plugin:core')
export interface PluginManifest {
  /**
   * The version of the plugin manifest format.
   */
  manifestVersion: string
  /**
   * The base URL for the plugin, used to resolve relative paths.
   * Should be set by plugin loader to the folder containing manifest unless the plugin sets it explicitly.
   */
  base: string
}

export interface PluginManifest_v1 extends PluginManifest {
  manifestVersion: '1'
  /**
   * The name of the plugin, used to identify it in the system.
   * It may contain lowercase letters, numbers, dashes, underscores and dots
   */
  name: string
  /**
   * The path to the plugin's entry point file, relative to the base URL.
   * This file should export a function that initializes the plugin.
   */
  entrypoint: string
}

export async function lookupManifest(): Promise<PluginManifest[]> {
  const require = createRequire(import.meta.url)
  const paths = await fg(
    require.resolve
      .paths('*')
      .flatMap((p) => [join(p, '*', 'yellow-plugin.json'), join(p, '@*', '*', 'yellow-plugin.json')])
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

await lookupManifest()
