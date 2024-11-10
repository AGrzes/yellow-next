import { Container } from 'inversify'
import { adbsModule } from '../adbs/module.js'
import { dynamicCliModule } from '../cli/dynamic.js'
import { cliModule } from '../cli/index.js'
import { serverCliModule } from '../cli/server.js'
import { emsModule } from '../ems/module.js'
import { serverModule } from '../server/module.js'
import { stateModule } from '../state/module.js'

export default async function createContainer() {
  const container = new Container()
  container.load(cliModule, serverCliModule, adbsModule, serverModule, emsModule, stateModule)
  await container.loadAsync(dynamicCliModule())
  return container
}
