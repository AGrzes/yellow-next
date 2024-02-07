/* c8 ignore start */
import { watch } from 'chokidar'
import { ContainerModule } from 'inversify'
import { FileSource } from './file-source.js'

export const adbsModule = new ContainerModule((bind) => {
  bind(watch).toConstantValue(watch)
  bind(FileSource).toSelf().inSingletonScope
})
