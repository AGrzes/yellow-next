import { Command } from 'commander'
import { ContainerModule, interfaces } from 'inversify'
import { ADBS } from '../adbs/adbs.js'
import { DocumentsHandler } from '../adbs/documents/server.js'
import { GraphHandler } from '../adbs/graph/server.js'
import { TocHandler } from '../adbs/toc/server.js'
import { EmsHandler } from '../ems/server.js'
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
        server.register({ handler: context.container.get(TocHandler).handler, path: '/toc' })
        server.register({ handler: context.container.get(DocumentsHandler).handler, path: '/', priority: 1000 })
        server.register({ handler: context.container.get(EmsHandler).handler, path: '/ems' })
        await server.start()
      })
      parent.addCommand(command)
      return command
    })
    .inSingletonScope()
    .whenTargetNamed('server')
})
