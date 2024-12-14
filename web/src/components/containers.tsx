import { Grid } from '@mui/material'
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
