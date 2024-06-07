import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import { List } from '@mui/material'
import React from 'react'
import { useModel } from '../model/index'
import { resolveComponent } from './entityComponents'

function EntitySubtree<T extends SemanticProxy>({
  TreeComponent,
  root,
  depth,
  children,
}: {
  TreeComponent: TreeComponentType
  root: T
  depth?: number
  children: (parent: T) => T[]
}) {
  depth = depth || 0
  return (
    <>
      <TreeComponent entity={root} depth={depth} />
      {children(root).map((entity) => (
        <EntitySubtree
          key={entity.iri}
          root={entity}
          TreeComponent={TreeComponent}
          children={children}
          depth={depth + 1}
        />
      ))}
    </>
  )
}

export type TreeComponentType = React.ComponentType<{ entity: any; depth: number }>

export function EntityTree<T extends SemanticProxy>({
  className,
  children,
  parent,
}: {
  className: string
  children: (parent: T) => T[]
  parent: (child: T) => T
}) {
  const model = useModel()
  const entities = model.all(className).filter((entity: T) => !parent(entity))
  const TreeComponent: TreeComponentType = resolveComponent<{ entity: any; depth: number }>({
    className,
    kind: 'treeItem',
  })
  return (
    <List>
      {entities.map((entity) => (
        <EntitySubtree key={entity.iri} root={entity} TreeComponent={TreeComponent} children={children} />
      ))}
    </List>
  )
}
