import { Router } from 'express'
import fs from 'fs/promises'
import { ContainerModule } from 'inversify'
import { StateHandler } from './server.js'
import { StateService } from './service.js'
import { FileStore } from './store.js'

export const stateModule = new ContainerModule((bind) => {
  bind(FileStore).toDynamicValue((context) => new FileStore('documents/store', fs))
  bind(StateService).toDynamicValue((context) => new StateService(context.container.get(FileStore), null))
  bind(StateHandler).toDynamicValue((context) => new StateHandler(Router(), context.container.get(StateService)))
})
