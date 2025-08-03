import { PluginContext } from '@agrzes/yellow-next-plugin-core'
import { Command, COMMAND, COMMAND_FACTORY, PROGRAM_NAME, ROOT_COMMAND } from './index.js'
function entrypoint({ manifest, registry }: PluginContext): void {
  registry.register({
    identifier: COMMAND_FACTORY,
    dependencies: [],
    factory: async ([]) => {
      return (name?: string) => new Command(name)
    },
  })
  registry.register({
    identifier: COMMAND,
    qualifier: ROOT_COMMAND,
    dependencies: [COMMAND_FACTORY],
    factory: ([commandFactory]) => {
      return commandFactory(PROGRAM_NAME)
    },
  })
}

export default entrypoint
