import debug from 'debug'
import fg from 'fast-glob'
import { Container } from 'inversify'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import { aware } from './context/aware.js'
import { InversifyContext } from './context/inversify.js'
import { createSetupContext } from './context/setup.js'
import { makeLookupManifests } from './lookup-manifests.js'
import { loadPlugin } from './plugin-loader.js'
const log = debug('yellow:plugin:core')

export const lookupManifests = makeLookupManifests(createRequire(import.meta.url).resolve.paths, fg, fs.readFile)
export const setupContext = createSetupContext(
  () => new Container({ defaultScope: 'Singleton' }),
  (container) => new InversifyContext(container),
  lookupManifests,
  loadPlugin,
  [aware]
)


export * from './context/index.js'
export type { PluginContext, PluginEntrypoint } from './plugin.js'

export * from './utils.js'
