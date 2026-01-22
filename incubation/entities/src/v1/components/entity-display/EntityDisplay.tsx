import type { UISchemaElement } from '@jsonforms/core'
import { JsonForms } from '@jsonforms/react'
import type { Entity } from '@v1/entity'
import { cells, renderers } from '@v1/json-forms'

export function EntityDisplay({ entity, uiSchema }: { entity: Entity<any>; uiSchema?: UISchemaElement }) {
  return (
    <JsonForms
      schema={entity.meta?.type?.schema}
      data={entity.body}
      uischema={uiSchema}
      renderers={renderers}
      cells={cells}
    />
  )
}
