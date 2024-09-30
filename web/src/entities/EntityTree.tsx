import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import { SxProps, Theme } from '@mui/material'
import React from 'react'
import { useModel } from '../model/index'
import { EntityTree as ET, TreeComponentType } from './../components'
import { resolveComponent } from './entityComponents'

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
  const TreeComponent: TreeComponentType = resolveComponent<{ entity: any; sx?: SxProps<Theme> }>({
    className,
    kind: 'treeItem',
  })
  return <ET TreeComponent={TreeComponent} children={children} roots={entities} />
}
