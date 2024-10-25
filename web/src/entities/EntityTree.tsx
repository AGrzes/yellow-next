import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import React from 'react'
import { useModel } from '../model/index'
import { EntityComponentType, EntityTree as ET, TreeComponentType, TreeOptions } from './../components'
import { useComponent } from './entityComponents'

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

export function entitySubTree<T extends SemanticProxy>(
  className: string,
  treeOptions: TreeOptions<T>
): EntityComponentType {
  return ({ entity }) => {
    const TreeComponent = useComponent(className, 'treeItem')
    return <ET TreeComponent={TreeComponent} children={treeOptions.children} roots={treeOptions.children(entity)} />
  }
}