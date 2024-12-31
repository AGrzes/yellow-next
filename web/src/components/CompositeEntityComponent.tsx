import Stack from '@mui/material/Stack'
import React from 'react'
import { EntityComponentType } from '.'

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
