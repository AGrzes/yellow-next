import { JsonForms } from '@jsonforms/react'
import { vanillaRenderers } from '@jsonforms/vanilla-renderers'
import { useState } from 'react'
import { Link, useLoaderData, type LoaderFunction } from 'react-router'
import { mantineCells } from '../json-forms/index.ts'

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
    (async () => {
      const response = await fetch('/schema/book-collection.schema.json')
      const schema = await response.json()
      return schema
    })(),
    (async () => {
      const response = await fetch('/ui-schema/book-item.uischema.json')
      const uiSchema = await response.json()
      return uiSchema
    })(),
    (async () => {
      const response = await fetch('/data/book-collection.data.json')
      const data: any[] = await response.json()
      return data
    })(),
  ])
  console.log('itemLoader', { params, schema, uiSchema, data })
  return { schema, uiSchema, item: data.find((item) => item.id === params.id) }
}