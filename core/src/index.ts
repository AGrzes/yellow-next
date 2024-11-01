/* c8 ignore start */
import 'reflect-metadata'

import entrypoint from './cli/index.js'
import createContainer from './container/index.js'

import { register } from 'node:module'

register('ts-node-maintained/esm', import.meta.url)

entrypoint(await createContainer(), process.argv)
