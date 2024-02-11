import { Container } from 'inversify'
import { adbsModule } from '../adbs/module.js'
import { cliModule } from '../cli/index.js'
import { serverCliModule } from '../cli/server.js'

export default async function createContainer() {
  const container = new Container()
  container.load(cliModule, serverCliModule, adbsModule)
  return container
}
