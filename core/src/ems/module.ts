import { Router } from 'express'
import { ContainerModule } from 'inversify'
import { EmsHandler } from './server.js'

export const emsModule = new ContainerModule((bind) => {
  bind(EmsHandler).toDynamicValue((context) => new EmsHandler(Router()))
})
