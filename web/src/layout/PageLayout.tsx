import {
  Box,
  Container,
  CssBaseline,
  Divider,
  Fab,
  Icon,
  List,
  ListItem,
  ListItemButton,
  Stack,
  SxProps,
  Theme,
} from '@mui/material'
import React, { Fragment } from 'react'
import { Link, Outlet, useLoaderData, useMatch } from 'react-router-dom'
import './PageLayout.scss'

interface TocNode {
  href: string
  label: string
  children: TocNode[]
}

export function TocItem({ item, level }: { item: TocNode; level: number }) {
  const href = item.href ? `/documents/${item.href}` : null
  const match = useMatch(href || '')
  return (
    <Fragment>
      {href ? (
        <ListItemButton component={Link} to={href} sx={{ padding: 0.25, paddingLeft: level }} selected={Boolean(match)}>
          {item.label}
        </ListItemButton>
      ) : (
        <ListItem sx={{ padding: 0.25, paddingLeft: level }}> {item.label}</ListItem>
      )}
      {item.children && <TocItems items={item.children} level={level + 1} />}
    </Fragment>
  )
}

export function TocItems({ items, level }: { items: TocNode[]; level?: number }) {
  level = level || 1
  return (
    <Fragment>
      {items.map((item: TocNode, index) => (
        <TocItem key={item.href || `${item.label}-${index}`} item={item} level={level}></TocItem>
      ))}
    </Fragment>
  )
}

export function Toc({ toc, sx }: { toc: TocNode[]; sx?: SxProps<Theme> }) {
  return (
    <List sx={sx}>
      <TocItems items={toc} />
    </List>
  )
}

export function PageLayout() {
  const toc = useLoaderData() as TocNode[]
  const [open, setOpen] = React.useState('toc')
  const switchOpen = (key: string) => () => {
    if (open === key) {
      setOpen('')
    } else {
      setOpen(key)
    }
  }
  return (
    <>
      <CssBaseline />
      <Stack direction="row" spacing={0} sx={{ position: 'fixed', top: 0, left: 0, height: 1 }}>
        <Box sx={{ padding: 1 }}>
          <Stack direction="column" onClick={switchOpen('toc')}>
            <Fab size="large" color="primary">
              <Icon>toc</Icon>
            </Fab>
          </Stack>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Toc
          toc={toc}
          sx={{
            minWidth: 100,
            display: open === 'toc' ? null : 'none',
            borderRight: 'solid rgba(0, 0, 0, 0.12) 1px',
          }}
        />
      </Stack>
      <Container>
        <Outlet />
      </Container>
    </>
  )
}

export async function pageLayoutLoader() {
  return await (await fetch('/toc')).json()
}
