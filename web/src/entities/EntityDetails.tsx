import React, { useMemo } from 'react'
import { useModel } from '../model/index'
import { resolveComponent } from './entityComponents'

export function EntityDetails({ className, iri }: { className: string; iri: string }) {
  const model = useModel()
  const entity = model.get(className, iri)
  const EntityDetails = useMemo(() => resolveComponent<{ entity: any }>({ className, kind: 'details' }), [className])
  return <EntityDetails entity={entity} />
}
