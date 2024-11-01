import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import React from 'react'
import { useClassConfig } from '../config'
import { EntityList } from './EntityList'
import { EntityTree } from './EntityTree'

export function EntityCollection<T extends SemanticProxy>({ className }: { className: string }) {
  const config = useClassConfig(className)
  switch (config.defaultCollectionDisplay) {
    case 'tree':
      return <EntityTree className={className} {...config.treeOptions} />
    default:
      return <EntityList className={className} />
  }
}
