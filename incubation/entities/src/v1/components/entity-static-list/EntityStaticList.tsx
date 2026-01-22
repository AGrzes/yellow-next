import type { UISchemaElement } from '@jsonforms/core'
import { JsonForms } from '@jsonforms/react'
import type { EntityList } from '@v1/entity'
import { cells, renderers } from '@v1/json-forms'

export function EntityStaticList({ list, uiSchema }: { list: EntityList<any>; uiSchema?: UISchemaElement }) {
  const listSchema = {
    type: 'array',
    items: list.meta?.type?.schema,
  }

  return (
    <JsonForms
      schema={listSchema}
      data={list.items.map((entity) => entity.body)}
      uischema={uiSchema}
      renderers={renderers}
      cells={cells}
    />
  )
}
