import { join } from 'path'
import { PluginManifest, PluginManifest_v1 } from './manifest.js'
import { PluginEntrypoint } from './plugin.js'

export async function loadPlugin(manifest: PluginManifest): Promise<PluginEntrypoint> {
  switch (manifest.manifestVersion) {
    case '1': {
      const v1 = manifest as PluginManifest_v1
      if (!v1.entrypoint) {
        throw new Error(`Plugin ${v1.name} manifest is missing entrypoint`)
      }
      if (!v1.base) {
        throw new Error(`Plugin ${v1.name} manifest is missing base`)
      }
      const entrypoint = await import(join(v1.base, v1.entrypoint))
      if (typeof entrypoint.default === 'function') {
        return entrypoint.default
      } else {
        throw new Error(`Plugin ${v1.name} does not export an entrypoint function`)
      }
    }
    default:
      throw new Error(`Unsupported plugin manifest version: ${manifest.manifestVersion}`)
  }
}
