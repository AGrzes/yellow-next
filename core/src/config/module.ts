import { Router } from 'express'
import { ContainerModule } from 'inversify'
import { ConfigHandler } from './server.js'

export const configModule = new ContainerModule((bind) => {
  bind(ConfigHandler).toDynamicValue((context) => new ConfigHandler(Router()))
})
