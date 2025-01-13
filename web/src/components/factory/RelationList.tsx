import { mostSpecificClass } from '@agrzes/yellow-next-shared/dynamic/utils'
import { List, ListSubheader } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import lodash from 'lodash'
import React, { useMemo } from 'react'
import { EntityComponentType } from '..'
import { useClassConfig } from '../../config'
import { useComponent } from '../../entities'
import { EntityListItemTemplate } from '../EntityListItemTemplate'
const { groupBy, entries, mapValues, camelCase, upperFirst } = lodash

export interface RelationListConfig {
  forward: string
  reverse: string
  target: string
  source: string
  kind?: string
  label?: string
  group?: string
  ForwardComponent: EntityComponentType
  ReverseComponent: EntityComponentType
}

interface RelationListItemConfig {
  relation: string
  RelationComponent: EntityComponentType
}

function relationListItem({ relation, RelationComponent }: RelationListItemConfig) {
  return ({ entity, sx }: { entity: any; sx?: SxProps<Theme> }) => {
    console.log(entity)
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
  group,
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
    console.log(forwardItems, reverseItems)

    if (!!forwardItems?.length || !!reverseItems?.length) {
      if (group) {
        const groups = mapValues(
          groupBy(
            [
              ...entries(mapValues(groupBy(forwardItems, group), (values) => ({ forward: values }))),
              ...entries(mapValues(groupBy(reverseItems, group), (values) => ({ reverse: values }))),
            ],
            ([key]) => key
          ),
          (values) =>
            values.reduce<{ forward?: any[]; reverse?: any[] }>((acc, [, value]) => ({ ...acc, ...value }), {})
        )
        console.log(groups)

        return (
          <List subheader={label && <ListSubheader>{label}</ListSubheader>}>
            {Object.entries(groups).map(([groupKey, groupItems]) => (
              <React.Fragment key={groupKey}>
                <ListSubheader>{upperFirst(camelCase(groupKey))}</ListSubheader>
                {groupItems.forward?.map((relation: any) => (
                  <ForwardRelationListItem entity={relation} key={relation.iri} />
                ))}
                {groupItems.reverse?.map((relation: any) => (
                  <ReverseRelationListItem entity={relation} key={relation.iri} />
                ))}
              </React.Fragment>
            ))}
          </List>
        )
      } else {
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
  }
}
