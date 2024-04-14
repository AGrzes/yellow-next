import { Icon, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { useModel } from '../model/index'

export function EntityClasses() {
  const model = useModel()
  return (
    <List>
      {model.classes
        .filter(({ internal }) => !internal)
        .map((clazz) => (
          <ListItemButton component={Link} to={clazz.name} key={clazz.name}>
            <ListItemIcon sx={{ minWidth: '32px' }}>
              <Icon>category</Icon>
            </ListItemIcon>
            <ListItemText primary={clazz.name} />
          </ListItemButton>
        ))}
    </List>
  )
}
