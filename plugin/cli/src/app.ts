import { ServiceRequest, setupContext } from '@agrzes/yellow-next-plugin-core'
import { COMMAND, ROOT_COMMAND } from './index.js'

const context = await setupContext()

await context.startup()

const root = await context.get(ServiceRequest.named(COMMAND, ROOT_COMMAND))

await root.parseAsync()

await context.shutdown()
