import { List } from '@mui/material'
import React from 'react'
import { TocItems } from './TocItems'
import { TocNode } from './model'

export function Toc({ toc }: { toc: TocNode[] }) {
  return (
    <List dense>
      <TocItems items={toc} />
    </List>
  )
}
