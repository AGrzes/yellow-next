import React from 'react'
import { useComponent } from '../entities/entityComponents.js'
import { useModel } from '../model/index'

export function EntityComponent({ className, iri, kind }: { className: string; iri: string; kind: string }) {
  const model = useModel()
  const entity = model.get(className, iri)
  const Content = useComponent(className, kind)
  return <Content entity={entity} />
}
