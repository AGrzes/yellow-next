import { Icon, SxProps, Theme } from '@mui/material'
import Divider from '@mui/material/Divider'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { entityDetailsLink } from '../entities/links'

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
