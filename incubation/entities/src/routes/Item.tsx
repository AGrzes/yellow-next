import { JsonForms } from '@jsonforms/react'
import { vanillaRenderers } from '@jsonforms/vanilla-renderers'
import { useState } from 'react'
import { Link, useLoaderData, type LoaderFunction } from 'react-router'
import { mantineCells } from '../json-forms/index.ts'
import { entityManager, schemaManager, uiSchemaManager } from '../service/index.ts'

export function Item() {
  const { schema, uiSchema, item } = useLoaderData()
  const [data, setData] = useState(item)
  return (
    <>
      <Link to={{ pathname: `/` }}>Back</Link>
      <JsonForms
        schema={schema}
        uischema={uiSchema}
        data={data}
        renderers={vanillaRenderers}
        cells={mantineCells}
        onChange={({ data }) => setData(data)}
      />
    </>
  )
}

export const itemLoader: LoaderFunction = async ({ params }) => {
  const [schema, uiSchema, data] = await Promise.all([
    schemaManager.getSchema('book'),
    uiSchemaManager.getUiSchema('book', 'collection'),
    entityManager.get('book', params.id!),
  ])
  console.log('itemLoader', { params, schema, uiSchema, data })
  return { schema, uiSchema, item: data }
}