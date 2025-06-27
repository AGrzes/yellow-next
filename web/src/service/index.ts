import { createContext } from 'react'

type Clazz<Instance> = new (...args: any[]) => Instance
type ServiceKey<Instance> = string | symbol | Clazz<Instance>

export interface ServiceLocator {
  get<Instance>(clazz: ServiceKey<Instance>): Instance
  set<Instance>(instance: Instance): void
  set<Instance>(clazz: ServiceKey<Instance>, instance: Instance): void
}

export class ServiceLocator {
  private registry: Map<ServiceKey<any>, any> = new Map()

  get<Instance>(clazz: ServiceKey<Instance>): Instance {
    return this.registry.get(clazz) as Instance
  }
  set<Instance>(clazzOrInstance: ServiceKey<Instance> | Instance, instance?: Instance): void {
    if (instance === undefined) {
      this.registry.set(instance.constructor as Clazz<Instance>, clazzOrInstance as Instance)
    } else {
      this.registry.set(clazzOrInstance as ServiceKey<Instance>, instance)
    }
  }
}
const ServiceContext = createContext(new ServiceLocator())
