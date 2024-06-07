import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import React from 'react'
import { config } from '../config/index'
import { EntityList } from './EntityList'
import { EntityTree } from './EntityTree'

export interface ClassConfig<T extends SemanticProxy> {
  defaultCollectionDisplay?: string
  treeOptions?: {
    children: (parent: T) => T[]
    parent: (child: T) => T
  }
}

const classConfig = (await config<{ classConfig: Record<string, ClassConfig<any>> }>()).classConfig || {}

export function resolveConfig<T extends SemanticProxy>(className: string): ClassConfig<T> {
  return classConfig[className] || {}
}

export function EntityCollection<T extends SemanticProxy>({ className }: { className: string }) {
  const config = resolveConfig<T>(className)
  switch (config.defaultCollectionDisplay) {
    case 'tree':
      return <EntityTree className={className} {...config.treeOptions} />
    default:
      return <EntityList className={className} />
  }
}
