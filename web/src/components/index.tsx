import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import { Box, Icon, List, SxProps, Theme, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import React from 'react'
import Markdown from 'react-markdown'
import { Link as RouterLink } from 'react-router-dom'
import { entityDetailsLink } from '../entities'
import { usePrint } from '../layout/index'

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

export const CompositeEntityComponent: EntityComponentType<{ items: EntityComponentType[] }> = ({
  entity,
  sx,
  items,
}) => {
  return (
    <Stack direction="row" sx={sx}>
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