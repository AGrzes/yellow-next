import { JsonForms } from '@jsonforms/react'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'
import { useState } from 'react'
import { useLoaderData, type LoaderFunction } from 'react-router'

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    done: {
      type: 'boolean',
    },
    due_date: {
      type: 'string',
      format: 'date',
    },
    recurrence: {
      type: 'string',
      enum: ['Never', 'Daily', 'Weekly', 'Monthly'],
    },
  },
  required: ['name', 'due_date'],
}
const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      label: false,
      scope: '#/properties/done',
    },
    {
      type: 'Control',
      scope: '#/properties/name',
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/due_date',
        },
        {
          type: 'Control',
          scope: '#/properties/recurrence',
        },
      ],
    },
  ],
}

const initialData = {}
export function Item() {
  const { schema, uiSchema, item } = useLoaderData()
  const [data, setData] = useState(item)
  return (
    <JsonForms
      schema={schema}
      uischema={uiSchema}
      data={data}
      renderers={vanillaRenderers}
      cells={vanillaCells}
      onChange={({ data }) => setData(data)}
    />
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
  return { schema, uiSchema, item: data[Number.parseInt(params.id!)] }
}