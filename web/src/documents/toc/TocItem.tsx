import { Collapse, Icon, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { Fragment } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { useSessionState } from '../../utils/index'
import { TocItems } from './TocItems'
import { TocNode } from './model'

export function TocItem({ item, level }: { item: TocNode; level: number }) {
  const href = item.href ? `/documents/${item.href}` : null
  const [expanded, setExpanded] = useSessionState(`toc-item-${item.path}`, false)
  const match = useMatch(href || '')
  const icon = item.children ? (href ? 'folder_open' : 'folder') : 'description'
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
          {item.children && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault()
                setExpanded(!expanded)
              }}
            >
              {expanded ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
            </IconButton>
          )}
        </ListItemButton>
      ) : (
        <ListItem sx={{ padding: 0.25, paddingLeft: level, paddingRight: 1 }}>
          <ListItemIcon sx={{ minWidth: '32px' }}>
            <Icon>{icon}</Icon>
          </ListItemIcon>
          <ListItemText primary={item.label} />
          {item.children && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault()
                setExpanded(!expanded)
              }}
            >
              {expanded ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
            </IconButton>
          )}
        </ListItem>
      )}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {item.children && <TocItems items={item.children} level={level + 1} />}
      </Collapse>
    </Fragment>
  )
}
