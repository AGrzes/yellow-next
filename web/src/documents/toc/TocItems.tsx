import React, { Fragment } from 'react'
import { TocItem } from './TocItem'
import { TocNode } from './model'

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
