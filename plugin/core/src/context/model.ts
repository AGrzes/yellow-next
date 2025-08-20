type Phantom<T> = {
  __type?: T
}
export type ServiceIdentifier<T> = (symbol | string) & Phantom<T>

export interface ServiceSelector<T> {
  identifier: ServiceIdentifier<T>
  optional?: boolean
  qualifier?: string
  multiple?: boolean
}

export interface MultipleServiceSelector<T> extends ServiceSelector<T> {
  multiple: true
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
  multiple: <T>(identifier: ServiceIdentifier<T>, optional = true): MultipleServiceSelector<T> => ({
    identifier,
    multiple: true,
    optional,
  }),
}

export interface ServiceLocator {
  get<T>(identifier: MultipleServiceSelector<T>): Promise<T[]>
  get<T>(identifier: ServiceRequest<T>): Promise<T>
}

export type ExtractServiceType<T> =
  T extends ServiceIdentifier<infer X>
    ? X
    : T extends MultipleServiceSelector<infer X>
      ? X[]
      : T extends ServiceSelector<infer X>
        ? X
        : never

export type DependencyTypes<T extends readonly ServiceRequest<any>[]> = {
  [K in keyof T]: ExtractServiceType<T[K]>
}

export interface ServiceRegistration<T, D extends readonly ServiceRequest<any>[]> {
  identifier: ServiceIdentifier<T>
  provided?: ServiceIdentifier<T>[]
  dependencies?: D
  factory: (dependencies: DependencyTypes<D>) => Promise<T> | T
  qualifier?: string
}

export interface ServiceRegistry {
  register<T, const D extends readonly ServiceRequest<any>[]>(registration: {
    identifier: ServiceIdentifier<T>
    provided?: ServiceIdentifier<T>[]
    dependencies?: D
    factory: (dependencies: DependencyTypes<D>) => Promise<T> | T
    qualifier?: string
  }): void
}

export interface ApplicationContext extends ServiceLocator, ServiceRegistry {
  startup(): Promise<void>
  shutdown(): Promise<void>
}
