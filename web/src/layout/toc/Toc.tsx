import { List, SxProps, Theme } from '@mui/material'
import React from 'react'
import { TocItems } from './TocItems'
import { TocNode } from './model'

export function Toc({ toc, sx }: { toc: TocNode[]; sx?: SxProps<Theme> }) {
  return (
    <List sx={sx}>
      <TocItems items={toc} />
    </List>
  )
}
