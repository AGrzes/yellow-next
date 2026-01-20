import { mantineCells, mantineRenderers } from '@agrzes/mantine-renderers'
import { JsonForms } from '@jsonforms/react'
import type { Entity } from '@v1/entity'

export function EntityDisplay({ entity }: { entity: Entity<any> }) {
  return (
    <div>
      <h2>Entity Type: {entity.type}</h2>
      <h3>Entity ID: {entity.id}</h3>
      <JsonForms
        schema={entity.meta?.type?.schema}
        data={entity.body}
        renderers={mantineRenderers}
        cells={mantineCells}
      />
    </div>
  )
}
