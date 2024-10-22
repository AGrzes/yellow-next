import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import { ComponentType } from 'react'
import { config } from '../config/index'
import { resolveConfig } from './config'

declare module './config' {
  interface ClassConfig<T extends SemanticProxy> {
    components?: Record<string, ComponentType<any>>
  }
}

export interface ResolveParams {
  className: string | string[]
  kind: string
}
export type EntityComponentFactory = (className: string, kind: string) => ComponentType<any>

const componentMap = (await config<{ componentMap: Record<string, ComponentType<any>> }>()).componentMap || {}
const legacyComponentFactory: EntityComponentFactory = (className, kind) => componentMap[`entity:${className}:${kind}`]

const directComponentFactory: EntityComponentFactory = (className, kind) => {
  const config = resolveConfig(className)
  return config.components?.[kind]
}

const componentFactories = [directComponentFactory, legacyComponentFactory]

export function resolveComponent<P = {}>({ className, kind }: ResolveParams): ComponentType<P> {
  if (!Array.isArray(className)) {
    className = [className]
  }
  for (const clazz of className) {
    const config = resolveConfig(clazz)
    const component = componentFactories.reduce((component, factory) => component || factory(clazz, kind), null)
    if (component) {
      return component as ComponentType<P>
    }
  }
  return (() => null) as ComponentType<P>
}
