import { mostSpecificClass } from '@agrzes/yellow-next-shared/dynamic/utils'
import { List, ListSubheader } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import { useClassConfig } from '../../config'
import { useComponent } from '../../entities'
import { EntityListItemTemplate } from '../EntityListItemTemplate'

export interface RelationListConfig {
  forward: string
  reverse: string
  target: string
  source: string
  kind?: string
}

interface RelationListItemConfig {
  relation: string
}

function relationListItem({ relation }: RelationListItemConfig) {
  return ({ entity, sx }: { entity: any; sx?: SxProps<Theme> }) => {
    const related = entity[relation]
    const clazz = useMemo(() => mostSpecificClass(...related.classes)?.name, [entity])
    const config = useClassConfig(clazz)
    const RelatedComponent = useComponent(clazz, 'summary')
    return (
      <EntityListItemTemplate
        class={clazz}
        icon={config.icon}
        iri={entity.source.iri}
        primary={[<Typography>{entity.reverse || entity.name}</Typography>, <RelatedComponent entity={related} />]}
        sx={sx}
      />
    )
  }
}

export function complexRelationList({ forward, reverse, target, source, kind }: RelationListConfig) {
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
    const ForwardRelationListItem = relationListItem({ relation: target })
    const ReverseRelationListItem = relationListItem({ relation: source })
    return (
      <List subheader={<ListSubheader>Relations</ListSubheader>}>
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
