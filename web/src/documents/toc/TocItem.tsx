import { Icon, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { Fragment } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { TocItems } from './TocItems'
import { TocNode } from './model'

export function TocItem({ item, level }: { item: TocNode; level: number }) {
  const href = item.href ? `/documents/${item.href}` : null
  const match = useMatch(href || '')
  const icon = href ? 'description' : 'folder'
  return (
    <Fragment>
      {href ? (
        <ListItemButton
          component={Link}
          to={href}
          sx={{ padding: 0.25, paddingLeft: level, paddingRight: 1 }}
          selected={Boolean(match)}
        >
          <ListItemIcon sx={{ minWidth: '32px' }}>
            <Icon>{icon}</Icon>
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ) : (
        <ListItem sx={{ padding: 0.25, paddingLeft: level, paddingRight: 1 }}>
          <ListItemIcon sx={{ minWidth: '32px' }}>
            <Icon>{icon}</Icon>
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItem>
      )}
      {item.children && <TocItems items={item.children} level={level + 1} />}
    </Fragment>
  )
}
