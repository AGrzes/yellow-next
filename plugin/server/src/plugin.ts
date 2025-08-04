import { COMMAND, COMMAND_FACTORY, ROOT_COMMAND } from '@agrzes/yellow-next-plugin-cli'
import { CONTEXT, PluginContext, ServiceIdentifier, ServiceRequest } from '@agrzes/yellow-next-plugin-core'
import express, { Router } from 'express'
import { ROUTER, ROUTER_FACTORY, SERVER, SERVER_COMMAND, SERVER_COMMAND_NAME } from './index.js'

export const EXPRESS: ServiceIdentifier<() => express.Express> = 'server.express'

function entrypoint({ registry }: PluginContext): void {
  registry.register({
    identifier: EXPRESS,
    dependencies: [],
    factory: async ([]) => {
      return express
    },
  })
  registry.register({
    identifier: ROUTER_FACTORY,
    dependencies: [],
    factory: async ([]) => {
      return Router
    },
  })

  registry.register({
    identifier: SERVER,
    dependencies: [ServiceRequest.named(CONTEXT, null), EXPRESS],
    factory: async ([context, appFactory]) => {
      const app = appFactory()
      const routers = await context.get(ServiceRequest.multiple(ROUTER))
      routers.forEach((router) => {
        app.use(router)
      })
      return app
    },
  })
  registry.register({
    identifier: SERVER_COMMAND,
    qualifier: SERVER_COMMAND_NAME,
    dependencies: [ServiceRequest.named(COMMAND, ROOT_COMMAND), SERVER, COMMAND_FACTORY],
    factory: ([root, server, commandFactory]) => {
      const serverCommand = commandFactory(SERVER_COMMAND_NAME)
      serverCommand.description('Start the server')
      serverCommand.action(async () => {
        const port = process.env.PORT || 3000
        server.listen(port, () => {
          console.log(`Server is running on http://localhost:${port}`)
        })
      })

      root.addCommand(serverCommand)
      return serverCommand
    },
    provided: [COMMAND],
  })
}

export default entrypoint
