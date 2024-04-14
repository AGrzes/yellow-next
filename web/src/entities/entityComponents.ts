import { ComponentType } from 'react'
import { config } from '../config/index'

export interface ResolveParams {
  className: string
  kind: string
}

const componentMap = (await config<{ componentMap: Record<string, ComponentType<any>> }>()).componentMap || {}

export function resolveComponent<P = {}>({ className, kind }: ResolveParams): ComponentType<P> {
  return componentMap[`entity:${className}:${kind}`] || ((() => null) as ComponentType<P>)
}
