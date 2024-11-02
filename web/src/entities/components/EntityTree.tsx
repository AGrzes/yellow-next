import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import React from 'react'
import { EntityTree as ET, TreeComponentType, TreeOptions } from '../../components'
import { useModel } from '../../model/index'
import { useComponent } from '../entityComponents'

export function EntityTree<T extends SemanticProxy>({
  className,
  children,
  parent,
}: {
  className: string
} & TreeOptions<T>) {
  const model = useModel()
  const entities = model.all(className).filter((entity: T) => !parent(entity))
  const TreeComponent: TreeComponentType = useComponent(className, 'treeItem')
  return <ET TreeComponent={TreeComponent} children={children} roots={entities} />
}
