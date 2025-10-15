import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import { List, ListSubheader } from '@mui/material'
import React from 'react'
import { EntityComponentType } from './index.js'

export function EntityList<T extends SemanticProxy>({
  items,
  ListItem,
  label,
}: {
  items: T[]
  ListItem: EntityComponentType
  label?: string
}) {
  return (
    <List subheader={<ListSubheader>{label}</ListSubheader>}>
      {items.map((entity) => (
        <ListItem key={entity.iri} entity={entity} />
      ))}
    </List>
  )
}
