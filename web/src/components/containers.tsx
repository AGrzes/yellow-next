import { Grid, Stack } from '@mui/material'
import React from 'react'
import { EntityComponentType } from './index.js'

export function columns(items: EntityComponentType[], widths: number[]) {
  return ({ entity }) => (
    <Grid container>
      {items.map((Item, index) => (
        <Grid item xs={widths[index]} key={index}>
          <Item entity={entity} />
        </Grid>
      ))}
    </Grid>
  )
}

export function stack(
  items: EntityComponentType[],
  direction: React.ComponentProps<typeof Stack>['direction'] = 'column'
) {
  return ({ entity, sx }) => (
    <Stack direction={direction} sx={sx}>
      {items.map((Item, index) => (
        <Item key={index} entity={entity} />
      ))}
    </Stack>
  )
}
