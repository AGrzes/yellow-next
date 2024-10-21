import { List } from '@mui/material'
import React, { useMemo } from 'react'
import { useModel } from '../model/index'
import { resolveComponent } from './entityComponents'

export function EntityList({ className }: { className?: string }) {
  const model = useModel()
  const entities = model.all(className)

  const EntityListItem = useMemo(() => resolveComponent<{ entity: any }>({ className, kind: 'listItem' }), [className])
  return (
    <List>
      {entities.map((entity) => (
        <EntityListItem key={entity.iri} entity={entity} />
      ))}
    </List>
  )
}
