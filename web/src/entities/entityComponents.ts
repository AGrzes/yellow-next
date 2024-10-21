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

const componentMap = (await config<{ componentMap: Record<string, ComponentType<any>> }>()).componentMap || {}

export function resolveComponent<P = {}>({ className, kind }: ResolveParams): ComponentType<P> {
  if (!Array.isArray(className)) {
    className = [className]
  }
  for (const clazz of className) {
    const config = resolveConfig(clazz)
    const component = config.components?.[kind] || componentMap[`entity:${clazz}:${kind}`]
    if (component) {
      return component as ComponentType<P>
    }
  }
  return (() => null) as ComponentType<P>
}
