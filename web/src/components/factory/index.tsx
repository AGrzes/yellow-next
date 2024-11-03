import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import { Box, List, ListItem, ListSubheader, Typography } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import { camelCase, flatMap, groupBy, mapValues, upperFirst } from 'lodash'
import React, { useMemo } from 'react'
import Markdown from 'react-markdown'
import { EntityComponentType, TreeComponentType } from '..'
import { useComponent } from '../../entities/entityComponents'
import { CompositeEntityComponent } from '../CompositeEntityComponent'
import { EntityTree } from '../EntityTree'

export { complexRelationList, RelationListConfig } from './RelationList'

export interface TreeOptions<T> {
  children: (parent: T) => T[]
  parent: (child: T) => T
}

export function inlineText(property: string): EntityComponentType {
  return ({ entity, sx }) => (
    <Box component="span" sx={sx}>
      {entity[property]}
    </Box>
  )
}

export function simpleText(property: string): EntityComponentType {
  return ({ entity, sx }) => (
    <Typography variant="body1" sx={sx}>
      {entity[property]}
    </Typography>
  )
}

export function richText(property: string): EntityComponentType {
  return ({ entity, sx }) => (
    <Box sx={sx}>
      <Markdown>{entity[property]}</Markdown>
    </Box>
  )
}

export function header(Component: EntityComponentType, level: number = 3): EntityComponentType {
  const Header = `h${level}` as keyof JSX.IntrinsicElements
  return ({ entity }) => (
    <Header>
      <Component entity={entity} />
    </Header>
  )
}

export function richTextList(property: string, label?: string): EntityComponentType {
  label = label || upperFirst(camelCase(property))
  return ({ entity, sx }) => {
    const values = useMemo((): any[] => entity[property] || [], [entity])

    return (
      !!values.length && (
        <List subheader={<ListSubheader>{label}</ListSubheader>} dense sx={sx}>
          {values.map((value: string, key: number) => (
            <ListItem key={key}>
              <ListItemText primary={<Markdown>{value}</Markdown>} />
            </ListItem>
          ))}
        </List>
      )
    )
  }
}

export function simpleList({
  property,
  primary,
  secondary,
  label,
}: {
  property: string
  primary: EntityComponentType[]
  secondary?: EntityComponentType[]
  label?: string
}): EntityComponentType {
  label = label || upperFirst(camelCase(property))
  return ({ entity, sx }) => {
    const values = useMemo((): any[] => entity[property] || [], [entity])

    return (
      !!values.length && (
        <List subheader={<ListSubheader>{label}</ListSubheader>} dense sx={sx}>
          {values.map((value: any, key: number) => (
            <ListItem key={key}>
              <ListItemText
                primary={<CompositeEntityComponent entity={value} items={primary} direction="row" />}
                secondary={secondary && <CompositeEntityComponent entity={value} items={secondary} direction="row" />}
                disableTypography
              />
            </ListItem>
          ))}
        </List>
      )
    )
  }
}

export function subTree<T extends SemanticProxy>({
  treeOptions,
  TreeComponent,
}: {
  treeOptions: TreeOptions<T>
  TreeComponent: TreeComponentType
}): EntityComponentType {
  return ({ entity }) => {
    return <EntityTree {...treeOptions} TreeComponent={TreeComponent} roots={treeOptions.children(entity)} />
  }
}

export function switchComponent(
  discriminator: string,
  cases: Record<string, EntityComponentType | EntityComponentType[]>
) {
  cases = mapValues(cases, (value) => (Array.isArray(value) ? value : [value]))
  return ({ entity }) => {
    const components = cases[entity[discriminator]] as EntityComponentType[]
    return components && <CompositeEntityComponent entity={entity} items={components} />
  }
}

export function groupedList({
  property,
  groupProperty,
  primary,
  secondary,
  label,
}: {
  property: string
  groupProperty: string
  primary: EntityComponentType[]
  secondary?: EntityComponentType[]
  label?: string
}): EntityComponentType {
  label = label || upperFirst(camelCase(property))
  return ({ entity, sx }) => {
    const values = useMemo((): any[] => entity[property] || [], [entity])
    const groups = useMemo(() => groupBy(values, groupProperty), [values, groupProperty])
    return (
      !!values.length && (
        <List subheader={<ListSubheader>{label}</ListSubheader>} dense sx={sx}>
          {flatMap(groups, (group: any[], groupKey: string) => [
            <ListSubheader key={groupKey}>{groupKey}</ListSubheader>,
            ...group.map((value, key) => (
              <ListItem key={key}>
                <ListItemText
                  primary={<CompositeEntityComponent entity={value} items={primary} direction="row" />}
                  secondary={secondary && <CompositeEntityComponent entity={value} items={secondary} direction="row" />}
                />
              </ListItem>
            )),
          ])}
        </List>
      )
    )
  }
}

export function relationList(className: string, property: string, label?: string): EntityComponentType {
  label = label || upperFirst(camelCase(property))

  return ({ entity }) => {
    const EntityListItem = useComponent(className, 'listItem')
    let entities = entity[property]
    if (!Array.isArray(entities)) {
      entities = entities ? [entities] : []
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

export function entitySubTree<T extends SemanticProxy>(
  className: string,
  treeOptions: TreeOptions<T>,
  label?: string
): EntityComponentType {
  return ({ entity }) => {
    const TreeComponent = useComponent(className, 'treeItem')
    return (
      <EntityTree
        TreeComponent={TreeComponent}
        children={treeOptions.children}
        roots={treeOptions.children(entity)}
        label={label}
      />
    )
  }
}
