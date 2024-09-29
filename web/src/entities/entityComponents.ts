import { ComponentType } from 'react'
import { config } from '../config/index'

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
    const component = componentMap[`entity:${clazz}:${kind}`]
    if (component) {
      return component as ComponentType<P>
    }
  }
  return (() => null) as ComponentType<P>
}
