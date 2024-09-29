import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import { config } from '../config/index'

export interface ClassConfig<T extends SemanticProxy> {
  defaultCollectionDisplay?: string
  treeOptions?: {
    children: (parent: T) => T[]
    parent: (child: T) => T
  }
  icon?: string
}

const classConfig = (await config<{ classConfig: Record<string, ClassConfig<any>> }>()).classConfig || {}

export function resolveConfig<T extends SemanticProxy>(className: string): ClassConfig<T> {
  return classConfig[className] || {}
}
