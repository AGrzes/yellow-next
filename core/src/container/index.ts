import { Container } from 'inversify'
import { adbsModule } from '../adbs/module.js'
import { cliModule } from '../cli/index.js'
import { serverCliModule } from '../cli/server.js'
import { serverModule } from '../server/module.js'

export default async function createContainer() {
  const container = new Container()
  container.load(cliModule, serverCliModule, adbsModule, serverModule)
  return container
}
