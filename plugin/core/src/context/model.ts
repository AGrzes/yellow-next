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
