import { Command } from 'commander'
import { ContainerModule, interfaces } from 'inversify'
import { ADBS } from '../adbs/adbs.js'
import { GraphHandler } from '../adbs/graph/server.js'
import { HttpServer } from '../server/server.js'

export const serverCliModule = new ContainerModule((bind) => {
  bind(Command)
    .toDynamicValue((context: interfaces.Context) => {
      const parent = context.container.getNamed(Command, 'root')
      const command = new Command('server')
      command.action(async () => {
        const adbs = await context.container.getAsync(ADBS)
        adbs.setupFileFlow(['documents'])
        adbs.setupGraphFlow()
        const server = await context.container.getAsync(HttpServer)
        server.register({ handler: context.container.get(GraphHandler).handler, path: '/graph' })
        await server.start()
      })
      parent.addCommand(command)
      return command
    })
    .inSingletonScope()
    .whenTargetNamed('server')
})
