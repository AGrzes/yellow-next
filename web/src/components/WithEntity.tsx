import { Box } from '@mui/material'
import React from 'react'
import { useModel } from '../model/index'
import { EntityComponentType } from './index.js'

export function WithEntity({
  className,
  iri,
  Content,
}: {
  className: string
  iri: string
  Content: EntityComponentType
}) {
  const model = useModel()
  const entity = model.get(className, iri)
  return <Content entity={entity} />
}

export function WithEntityList({
  className,
  iris,
  Content,
}: {
  className: string
  iris: string[]
  Content: EntityComponentType
}) {
  return (
    <Box>
      {iris.map((iri) => (
        <WithEntity key={iri} className={className} iri={iri} Content={Content} />
      ))}
    </Box>
  )
}
