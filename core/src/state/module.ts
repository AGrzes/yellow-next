import { Router } from 'express'
import { ContainerModule } from 'inversify'
import { StateHandler } from './server'
import { StateService } from './service'

export const stateModule = new ContainerModule((bind) => {
  bind(StateService).toSelf()
  bind(StateHandler).toDynamicValue((context) => new StateHandler(Router(), context.container.get(StateService)))
})
