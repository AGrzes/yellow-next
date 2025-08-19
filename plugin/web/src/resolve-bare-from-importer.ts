import path from 'node:path'
import resolve from 'resolve'
import { Plugin } from 'vite'

export function resolveBareFromImporter(): Plugin {
  return {
    name: 'resolve-bare-from-importer',
    async resolveId(source, importer) {
      if (!importer) {
        return null
      }
      if (resolve.isCore(source)) {
        return null
      }
      try {
        const resolved = resolve.sync(source, { basedir: path.dirname(importer) })
        return resolved
      } catch {
        return null
      }
    },
  }
}
