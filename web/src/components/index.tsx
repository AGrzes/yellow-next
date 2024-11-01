import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import { Box, Icon, List, ListItem, ListSubheader, SxProps, Theme, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { camelCase, flatMap, groupBy, mapValues, upperFirst } from 'lodash'
import React, { useMemo } from 'react'
import Markdown from 'react-markdown'
import { Link as RouterLink } from 'react-router-dom'
import { entityDetailsLink } from '../entities/links'
import { usePrint } from '../layout/index'

export interface TreeOptions<T> {
  children: (parent: T) => T[]
  parent: (child: T) => T
}

export function EntityListItemTemplate({
  class: clazz,
  icon,
  iri,
  primary,
  sx,
}: {
  class: string
  iri: string
  icon: string
  primary: any[]
  sx?: SxProps<Theme>
}) {
  return (
    <ListItemButton component={RouterLink} to={entityDetailsLink(clazz, iri)} sx={sx}>
      <ListItemAvatar>
        <Icon>{icon}</Icon>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1}>
            {primary && primary.map((item, index) => <React.Fragment key={index}>{item}</React.Fragment>)}
          </Stack>
        }
      ></ListItemText>
    </ListItemButton>
  )
}

export function EntityDetailsTemplate({ title, content }: { title: any; content: any }) {
  const print = usePrint()
  return print ? (
    <Box>
      <Typography variant="h2" gutterBottom>
        {title}
      </Typography>
      {content}
    </Box>
  ) : (
    <Container maxWidth={false}>
      <Card>
        <CardHeader title={title}></CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    </Container>
  )
}

function EntitySubtree<T extends SemanticProxy>({
  TreeComponent,
  root,
  depth,
  children,
}: {
  TreeComponent: TreeComponentType
  root: T
  depth?: number
  children: (parent: T) => T[]
}) {
  depth = depth || 0
  return (
    <>
      <TreeComponent entity={root} sx={{ pl: depth * 4 + 2 }} />
      {children(root).map((entity) => (
        <EntitySubtree
          key={entity.iri}
          root={entity}
          TreeComponent={TreeComponent}
          children={children}
          depth={depth + 1}
        />
      ))}
    </>
  )
}

export type EntityComponentType<T = {}> = React.ComponentType<{ entity: any; sx?: SxProps<Theme> } & T>
export type EntityComponentProps = React.ComponentProps<EntityComponentType>
export type TreeComponentType = EntityComponentType

export function EntityTree<T extends SemanticProxy>({
  children,
  roots,
  TreeComponent,
}: {
  children: (parent: T) => T[]
  roots: T[]
  TreeComponent: TreeComponentType
}) {
  return (
    <List>
      {roots.map((entity) => (
        <EntitySubtree key={entity.iri} root={entity} TreeComponent={TreeComponent} children={children} />
      ))}
    </List>
  )
}

export const CompositeEntityComponent: EntityComponentType<{
  items: EntityComponentType[]
  direction?: React.ComponentProps<typeof Stack>['direction']
}> = ({ entity, sx, items, direction = 'column' }) => {
  return (
    <Stack direction={direction} sx={sx}>
      {items.map((Item, index) => (
        <Item key={index} entity={entity} />
      ))}
    </Stack>
  )
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
