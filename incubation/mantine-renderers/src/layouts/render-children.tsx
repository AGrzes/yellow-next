import type { JsonSchema, Layout } from '@jsonforms/core'
import { JsonFormsDispatch, useJsonForms } from '@jsonforms/react'

export const renderChildren = (layout: Layout, schema: JsonSchema, path: string, enabled: boolean) => {
  if (!layout.elements?.length) {
    return []
  }

  const { renderers, cells } = useJsonForms()

  return layout.elements.map((child, index) => (
    <JsonFormsDispatch
      key={`${path}-${index}`}
      renderers={renderers}
      cells={cells}
      uischema={child}
      schema={schema}
      path={path}
      enabled={enabled}
    />
  ))
}
