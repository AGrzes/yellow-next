import { mantineCells, mantineRenderers } from '@agrzes/mantine-renderers'
import { JsonForms } from '@jsonforms/react'
import { useState } from 'react'
import { Link, useLoaderData, type LoaderFunction } from 'react-router'
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
        renderers={mantineRenderers}
        cells={mantineCells}
        onChange={({ data }) => setData(data)}
      />
    </>
  )
}

export const itemLoader: LoaderFunction = async ({ params }) => {
  const [schema, uiSchema, data] = await Promise.all([
    schemaManager.getSchema('book'),
    uiSchemaManager.getUiSchema('book', 'item'),
    entityManager.get('book', params.id!),
  ])
  return { schema: schema.properties.books.items, uiSchema, item: data }
}
