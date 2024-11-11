import { Router } from 'express'
import { ContainerModule } from 'inversify'
import { StateHandler } from './server.js'
import { StateService } from './service.js'

export const stateModule = new ContainerModule((bind) => {
  bind(StateService).toSelf()
  bind(StateHandler).toDynamicValue((context) => new StateHandler(Router(), context.container.get(StateService)))
})
