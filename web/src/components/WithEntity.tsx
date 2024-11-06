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
