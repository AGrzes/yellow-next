import { mostSpecificClass } from '@agrzes/yellow-next-shared/dynamic/utils'
import { List, ListSubheader } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import React, { useMemo } from 'react'
import { EntityComponentType } from '..'
import { useClassConfig } from '../../config'
import { useComponent } from '../../entities'
import { EntityListItemTemplate } from '../EntityListItemTemplate'

export interface RelationListConfig {
  forward: string
  reverse: string
  target: string
  source: string
  kind?: string
  label?: string
  ForwardComponent: EntityComponentType
  ReverseComponent: EntityComponentType
}

interface RelationListItemConfig {
  relation: string
  RelationComponent: EntityComponentType
}

function relationListItem({ relation, RelationComponent }: RelationListItemConfig) {
  return ({ entity, sx }: { entity: any; sx?: SxProps<Theme> }) => {
    const related = entity[relation]
    const clazz = useMemo(() => mostSpecificClass(...related.classes)?.name, [entity])
    const config = useClassConfig(clazz)
    const RelatedComponent = useComponent(clazz, 'summary')
    return (
      <EntityListItemTemplate
        class={clazz}
        icon={config.icon}
        iri={related.iri}
        primary={[<RelationComponent entity={entity} />, <RelatedComponent entity={related} />]}
        sx={sx}
      />
    )
  }
}

export function complexRelationList({
  forward,
  reverse,
  target,
  source,
  kind,
  label,
  ForwardComponent,
  ReverseComponent,
}: RelationListConfig) {
  return ({ entity }: { entity: any }) => {
    const forwardItems = useMemo(() => {
      if (kind) {
        return entity[forward].filter((relation: any) => relation.kind === kind)
      } else {
        return entity[forward]
      }
    }, [entity, kind])
    const reverseItems = useMemo(() => {
      if (kind) {
        return entity[reverse].filter((relation: any) => relation.kind === kind)
      } else {
        return entity[reverse]
      }
    }, [entity, kind])
    const ForwardRelationListItem = relationListItem({ relation: target, RelationComponent: ForwardComponent })
    const ReverseRelationListItem = relationListItem({ relation: source, RelationComponent: ReverseComponent })
    return (
      <List subheader={label && <ListSubheader>{label}</ListSubheader>}>
        {forwardItems.map((relation: any) => (
          <ForwardRelationListItem entity={relation} key={relation.iri} />
        ))}
        {reverseItems.map((relation: any) => (
          <ReverseRelationListItem entity={relation} key={relation.iri} />
        ))}
      </List>
    )
  }
}
