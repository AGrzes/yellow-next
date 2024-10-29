import { Command } from 'commander'
import debug from 'debug'
import { readdir } from 'fs/promises'
import { AsyncContainerModule, interfaces } from 'inversify'
import { extname, join } from 'path'
import { cwd } from 'process'

const log = debug('yellow:cli:dynamic')

interface CommandDefinition {
  name: string
  parent?: string
  default: CommandFactory
}

type CommandFactory = (container: interfaces.Container) => Command

export const dynamicCliModule = (commandDirectory: string = join(cwd(), 'commands')) =>
  new AsyncContainerModule(async (bind) => {
    try {
      const commandDefinitions = await readdir(commandDirectory)
      await Promise.all(
        commandDefinitions
          .filter((commandDefinition) => ['.js', '.ts'].includes(extname(commandDefinition)))
          .map(async (commandDefinition) => {
            const {
              name,
              parent,
              default: factory,
            } = (await import(join(commandDirectory, commandDefinition))) as CommandDefinition

            bind(Command)
              .toDynamicValue(async (context) => {
                const parentCommand = context.container.getNamed(Command, parent || 'root')
                const command = await factory(context.container)
                parentCommand.addCommand(command)
                return command
              })
              .inSingletonScope()
              .whenTargetNamed(name)
          })
      )
    } catch (e) {
      if (e.code === 'ENOENT') {
        log('No dynamic commands found in %s, ignoring', commandDirectory)
      } else {
        throw e
      }
    }
  })
