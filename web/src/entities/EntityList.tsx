import { List, ListSubheader } from '@mui/material'
import { camelCase, upperFirst } from 'lodash'
import React from 'react'
import { EntityComponentType } from '../components/index.js'
import { useModel } from '../model/index'
import { useComponent } from './entityComponents'

export function EntityList({ className }: { className?: string }) {
  const model = useModel()
  const entities = model.all(className)

  const EntityListItem = useComponent(className, 'listItem')
  return (
    <List>
      {entities.map((entity) => (
        <EntityListItem key={entity.iri} entity={entity} />
      ))}
    </List>
  )
}

export function relationList(className: string, property: string, label?: string): EntityComponentType {
  label = label || upperFirst(camelCase(property))

  return ({ entity }) => {
    const EntityListItem = useComponent(className, 'listItem')
    let entities = entity[property]
    if (!Array.isArray(entities)) {
      entities = [entities]
    }
    return (
      !!entities.length && (
        <List subheader={<ListSubheader>{label}</ListSubheader>}>
          {entities.map((entity) => (
            <EntityListItem key={entity.iri} entity={entity} />
          ))}
        </List>
      )
    )
  }
}
