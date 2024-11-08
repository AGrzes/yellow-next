import { Router } from 'express'
import { ContainerModule } from 'inversify'
import { EmsHandler } from './server.js'
import { EmsService } from './service.js'

export const emsModule = new ContainerModule((bind) => {
  bind(EmsService).toSelf()
  bind(EmsHandler).toDynamicValue((context) => new EmsHandler(Router(), context.container.get(EmsService)))
})
