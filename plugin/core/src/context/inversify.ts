import { BindingConstraints, Container } from 'inversify'
import lodash from 'lodash'
import { SHUTDOWN, STARTUP } from './lifecycle.js'
import { ApplicationContext, DependencyTypes, ServiceRegistration, ServiceRequest } from './model.js'
const { isObject } = lodash

const QUALIFIER_KEY = 'qualifier'

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
        tag: qualifier ? { key: QUALIFIER_KEY, value: qualifier } : undefined,
        optional: optional,
      })
    } else {
      return this.container.getAsync<T>(identifier, {
        tag: qualifier ? { key: QUALIFIER_KEY, value: qualifier } : undefined,
        optional: optional,
      })
    }
  }

  register<T, D extends readonly ServiceRequest<any>[]>(registration: ServiceRegistration<T, D>): void {
    const { identifier, dependencies, factory, qualifier } = registration
    const constraint = (request: BindingConstraints) => {
      const tag = request.tags?.get(QUALIFIER_KEY)
      return !tag || tag === qualifier
    }
    this.container
      .bind<T>(identifier)
      .toDynamicValue(async (context) => {
        const deps = dependencies ? await Promise.all(dependencies.map((dep) => this.get(dep))) : []
        return factory(deps as DependencyTypes<D>)
      })
      .inSingletonScope()
      .when(constraint)
    if (registration.provided) {
      registration.provided.forEach((providedIdentifier) => {
        this.container
          .bind(providedIdentifier)
          .toDynamicValue(async () => this.get(identifier))
          .when(constraint)
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
