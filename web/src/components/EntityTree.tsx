import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import { List, ListSubheader } from '@mui/material'
import React from 'react'
import { TreeComponentType } from '.'

export interface TreeOptions<T> {
  children: (parent: T) => T[]
  parent: (child: T) => T
}

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
      <TreeComponent entity={root} sx={{ pl: depth * 4 + 2 }} />
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

export function EntityTree<T extends SemanticProxy>({
  children,
  roots,
  TreeComponent,
  label,
}: {
  children: (parent: T) => T[]
  roots: T[]
  TreeComponent: TreeComponentType
  label?: string
}) {
  return (
    !!roots?.length && (
      <List subheader={<ListSubheader>{label}</ListSubheader>}>
        {roots.map((entity) => (
          <EntitySubtree key={entity.iri} root={entity} TreeComponent={TreeComponent} children={children} />
        ))}
      </List>
    )
  )
}
