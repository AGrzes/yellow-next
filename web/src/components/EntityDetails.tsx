import React from 'react'
import { useComponent } from '../entities/entityComponents'
import { useModel } from '../model/index'

export function EntityDetails({ className, iri }: { className: string; iri: string }) {
  const model = useModel()
  const entity = model.get(className, iri)

  const EntityDetails = useComponent(className, 'details')
  return <EntityDetails entity={entity} />
}
