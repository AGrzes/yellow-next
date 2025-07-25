import { Container } from 'inversify'
import { isObject } from 'lodash'
import { lookupManifests } from './index.js'
import { loadPlugin } from './plugin-loader.js'

type Never<T> = T extends unknown ? never : never
export type ServiceIdentifier<T> = symbol | string | Never<T>

export interface ServiceSelector<T> {
  identifier: ServiceIdentifier<T>
  optional?: boolean
  qualifier?: string
  multiple?: boolean
}

export type ServiceRequest<T> = ServiceIdentifier<T> | ServiceSelector<T>

export const ServiceRequest = {
  simple: <T>(identifier: ServiceIdentifier<T>): ServiceSelector<T> => ({
    identifier,
  }),
  named: <T>(identifier: ServiceIdentifier<T>, qualifier: string): ServiceSelector<T> => ({
    identifier,
    qualifier,
  }),
  optional: <T>(identifier: ServiceIdentifier<T>): ServiceSelector<T> => ({
    identifier,
    optional: true,
  }),
  multiple: <T>(identifier: ServiceIdentifier<T>, optional = true): ServiceSelector<T> & { multiple: true } => ({
    identifier,
    multiple: true,
    optional,
  }),
}

export interface ServiceLocator {
  get<T>(identifier: ServiceSelector<T> & { multiple: true }): Promise<T[]>
  get<T>(identifier: ServiceRequest<T>): Promise<T>
}

export type ExtractServiceType<T> = T extends ServiceRequest<infer X> ? X : never

export type DependencyTypes<T extends readonly ServiceRequest<any>[]> = {
  [K in keyof T]: ExtractServiceType<T[K]>
}

export interface ServiceRegistration<T, D extends readonly ServiceRequest<any>[]> {
  identifier: ServiceIdentifier<T>
  provided?: ServiceIdentifier<T>[]
  dependencies?: D
  factory: (dependencies: DependencyTypes<D>) => T
  qualifier?: string
}

export interface ServiceRegistry {
  register<T, D extends readonly ServiceRequest<any>[]>(registration: ServiceRegistration<T, D>): void
}

export interface ApplicationContext extends ServiceLocator, ServiceRegistry {
  startup(): Promise<void>
  shutdown(): Promise<void>
}

const QUALIFIER_KEY = 'qualifier'

export type Startup = () => Promise<void>
export type Shutdown = () => Promise<void>

export const STARTUP: ServiceIdentifier<Startup> = Symbol.for('startup')
export const SHUTDOWN: ServiceIdentifier<Shutdown> = Symbol.for('shutdown')

export class InversifyContext implements ApplicationContext {
  private container: Container

  constructor(container: Container) {
    this.container = container
  }
  get<T>(identifier: ServiceRequest<T> & { multiple: true }): Promise<T[]>
  get<T>(identifier: ServiceRequest<T>): Promise<T>
  get<T>(request: ServiceRequest<T>): Promise<T> | Promise<T[]> {
    request = isObject(request) ? request : ServiceRequest.simple(request)
    const { identifier, optional, qualifier, multiple } = request
    if (multiple) {
      return this.container.getAllAsync<T>(identifier, {
        tag: { key: QUALIFIER_KEY, value: qualifier },
        optional: optional,
      })
    } else {
      return this.container.getAsync<T>(identifier, {
        tag: { key: QUALIFIER_KEY, value: qualifier },
        optional: optional,
      })
    }
  }

  register<T, D extends readonly ServiceRequest<any>[]>(registration: ServiceRegistration<T, D>): void {
    const { identifier, dependencies, factory, qualifier } = registration
    const binder = this.container
      .bind<T>(identifier)
      .toDynamicValue((context) => {
        const deps = dependencies ? dependencies.map((dep) => this.get(dep)) : []
        return factory(deps as DependencyTypes<D>)
      })
      .inSingletonScope()
    if (qualifier) {
      binder.whenTagged(QUALIFIER_KEY, qualifier)
    }
    if (registration.provided) {
      registration.provided.forEach((providedIdentifier) => {
        this.container.bind(providedIdentifier).toService(identifier)
      })
    }
  }

  async startup(): Promise<void> {
    const startupServices = await this.get(ServiceRequest.multiple(STARTUP))
    for (const startupService of startupServices) {
      await startupService()
    }
  }

  async shutdown(): Promise<void> {
    const shutdownServices = await this.get(ServiceRequest.multiple(SHUTDOWN))
    const errors = []
    for (const shutdownService of shutdownServices) {
      try {
        await shutdownService()
      } catch (error) {
        errors.push(error)
      }
    }
    if (errors.length > 0) {
      throw new Error(`Errors during shutdown`, {
        cause: errors,
      })
    }
  }
}

export async function setupContext(): Promise<ApplicationContext> {
  const container = new Container({ defaultScope: 'Singleton' })
  const context = new InversifyContext(container)
  const manifests = await lookupManifests()
  for (const manifest of manifests) {
    const entrypoint = await loadPlugin(manifest)
    entrypoint({ manifest, registry: context })
  }
  return context
}
