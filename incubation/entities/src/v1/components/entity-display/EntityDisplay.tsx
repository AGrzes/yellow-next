import { mantineCells, mantineRenderers } from '@agrzes/mantine-renderers'
import type { UISchemaElement } from '@jsonforms/core'
import { JsonForms } from '@jsonforms/react'
import type { Entity } from '@v1/entity'

export function EntityDisplay({ entity, uiSchema }: { entity: Entity<any>; uiSchema?: UISchemaElement }) {
  return (
    <JsonForms
      schema={entity.meta?.type?.schema}
      data={entity.body}
      uischema={uiSchema}
      renderers={mantineRenderers}
      cells={mantineCells}
    />
  )
}
