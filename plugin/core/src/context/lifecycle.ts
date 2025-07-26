import { ServiceIdentifier } from './model.js'

export type Startup = () => Promise<void>
export type Shutdown = () => Promise<void>

export const STARTUP: ServiceIdentifier<Startup> = Symbol.for('startup')
export const SHUTDOWN: ServiceIdentifier<Shutdown> = Symbol.for('shutdown')
