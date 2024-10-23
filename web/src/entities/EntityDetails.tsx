import React from 'react'
import { useModel } from '../model/index'
import { useComponent } from './entityComponents'

export function EntityDetails({ className, iri }: { className: string; iri: string }) {
  const model = useModel()
  const entity = model.get(className, iri)

  const EntityDetails = useComponent(className, 'details')
  return <EntityDetails entity={entity} />
}
