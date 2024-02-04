/* c8 ignore start */
import entrypoint from './cli/index.js'
import createContainer from './container/index.js'
entrypoint(await createContainer(), process.argv)
