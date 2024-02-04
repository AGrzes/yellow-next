import { Container } from 'inversify'
import { cliModule } from '../cli/index.js'

export default async function createContainer() {
  const container = new Container()
  container.load(cliModule)
  return container
}
