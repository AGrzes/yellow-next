import { JsonForms } from '@jsonforms/react'
import { vanillaRenderers } from '@jsonforms/vanilla-renderers'
import { Link, useLoaderData, type LoaderFunction } from 'react-router'
import { mantineCells } from '../json-forms/index.ts'

type CollectionLoaderData = {
  schema: any
  uiSchema: any
  items: any[]
}

export function Collection() {
  const { schema, uiSchema, items } = useLoaderData() as CollectionLoaderData

  return (
    <ul>
      {items.map((item, index) => (
        <li key={item.id ?? index}>
          <JsonForms
            schema={schema}
            uischema={uiSchema}
            data={item}
            renderers={vanillaRenderers}
            cells={mantineCells}
            readonly={true}
          />
          <Link to={{ pathname: `/${item.id}` }}>Details</Link>
        </li>
      ))}
    </ul>
  )
}

export const collectionLoader: LoaderFunction = async () => {
  const [schema, uiSchema, data] = await Promise.all([
    (async () => {
      const response = await fetch('/schema/book-collection.schema.json')
      const schema = await response.json()
      return schema
    })(),
    (async () => {
      const response = await fetch('/ui-schema/book-collection.uischema.json')
      const uiSchema = await response.json()
      return uiSchema
    })(),
    (async () => {
      const response = await fetch('/data/book-collection.data.json')
      const data: any[] = await response.json()
      return data
    })(),
  ])
  const itemSchema = (schema as any).items ?? schema
  console.log('collectionLoader', { schema: itemSchema, uiSchema, data })
  return { schema: itemSchema, uiSchema, items: data }
}
