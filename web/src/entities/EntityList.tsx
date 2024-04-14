import { List } from '@mui/material'
import React from 'react'
import { useModel } from '../model/index'
import { resolveComponent } from './entityComponents'

export function EntityList({ className }: { className?: string }) {
  const model = useModel()
  const entities = model.all(className)
  const EntityListItem = resolveComponent<{ entity: any }>({ className, kind: 'listItem' })
  return (
    <List>
      {entities.map((entity) => (
        <EntityListItem key={entity.iri} entity={entity} />
      ))}
    </List>
  )
}
