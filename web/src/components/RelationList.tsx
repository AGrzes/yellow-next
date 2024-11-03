import { mostSpecificClass } from '@agrzes/yellow-next-shared/dynamic/utils'
import { List, ListSubheader } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import { useClassConfig } from '../config'
import { useComponent } from '../entities'
import { EntityListItemTemplate } from './EntityListItemTemplate'

export function ForwardRelationListItem({ entity, sx }: { entity: any; sx?: SxProps<Theme> }) {
  const clazz = useMemo(() => mostSpecificClass(...entity.target.classes)?.name, [entity])
  const config = useClassConfig(clazz)
  const RelatedComponent = useComponent(clazz, 'summary')
  return (
    <EntityListItemTemplate
      class={clazz}
      icon={config.icon}
      iri={entity.target.iri}
      primary={[<Typography>{entity.forward || entity.name}</Typography>, <RelatedComponent entity={entity.target} />]}
      sx={sx}
    />
  )
}
export function ReverseRelationListItem({ entity, sx }: { entity: any; sx?: SxProps<Theme> }) {
  const clazz = useMemo(() => mostSpecificClass(...entity.source.classes)?.name, [entity])
  const config = useClassConfig(clazz)
  const RelatedComponent = useComponent(clazz, 'summary')
  return (
    <EntityListItemTemplate
      class={clazz}
      icon={config.icon}
      iri={entity.source.iri}
      primary={[<Typography>{entity.reverse || entity.name}</Typography>, <RelatedComponent entity={entity.source} />]}
      sx={sx}
    />
  )
}

export function RelationList({ entity, kind }: { entity: any; kind?: string }) {
  const forward = useMemo(() => {
    if (kind) {
      return entity.relation.filter((relation: any) => relation.kind === kind)
    } else {
      return entity.relation
    }
  }, [entity, kind])
  const reverse = useMemo(() => {
    if (kind) {
      return entity.reverseRelation.filter((relation: any) => relation.kind === kind)
    } else {
      return entity.reverseRelation
    }
  }, [entity, kind])

  return (
    <List subheader={<ListSubheader>Relations</ListSubheader>}>
      {forward.map((relation: any) => (
        <ForwardRelationListItem entity={relation} key={relation.iri} />
      ))}
      {reverse.map((relation: any) => (
        <ReverseRelationListItem entity={relation} key={relation.iri} />
      ))}
    </List>
  )
}
