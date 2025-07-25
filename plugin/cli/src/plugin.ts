import { PluginContext } from '@agrzes/yellow-next-plugin-core'
import { Command, COMMAND, PROGRAM_NAME, ROOT_COMMAND } from './index.js'
function entrypoint({ manifest, registry }: PluginContext): void {
  registry.register({
    identifier: COMMAND,
    qualifier: ROOT_COMMAND,
    factory: () => {
      return new Command(PROGRAM_NAME).help()
    },
  })
}

export default entrypoint
