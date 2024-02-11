import { Command } from 'commander'
import { ContainerModule, interfaces } from 'inversify'
import { ADBS } from '../adbs/adbs.js'

export const serverCliModule = new ContainerModule((bind) => {
  bind(Command)
    .toDynamicValue((context: interfaces.Context) => {
      const parent = context.container.getNamed(Command, 'root')
      const command = new Command('server')
      command.action(async () => (await context.container.getAsync(ADBS)).setupFileFlow(['documents']))
      parent.addCommand(command)
      return command
    })
    .inSingletonScope()
    .whenTargetNamed('server')
})
