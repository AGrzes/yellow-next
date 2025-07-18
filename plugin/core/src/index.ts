import debug from 'debug'
import fg from 'fast-glob'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import { makeLookupManifest } from './lookup-manifests.js'

const log = debug('yellow:plugin:core')

export const lookupManifest = makeLookupManifest(createRequire(import.meta.url).resolve.paths, fg, fs.readFile)