import { SxProps, Theme } from '@mui/material'
import React from 'react'

export { CompositeEntityComponent } from './CompositeEntityComponent'
export { EntityDetails } from './EntityDetails'
export { EntityDetailsTemplate } from './EntityDetailsTemplate'
export { EntityListItemTemplate } from './EntityListItemTemplate'
export { EntityTree } from './EntityTree'
export * from './factory'

export type EntityComponentType<T = {}> = React.ComponentType<{ entity: any; sx?: SxProps<Theme> } & T>
export type EntityComponentProps = React.ComponentProps<EntityComponentType>
export type TreeComponentType = EntityComponentType
