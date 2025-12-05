import { JsonForms } from '@jsonforms/react'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'
import { useState } from 'react'
import { useLoaderData } from 'react-router'

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
  console.log('useLoaderData', useLoaderData())
  const { item } = useLoaderData()
  const [data, setData] = useState(initialData)
  return (
    <JsonForms
      schema={schema}
      uischema={uischema}
      data={data}
      renderers={vanillaRenderers}
      cells={vanillaCells}
      onChange={({ data }) => setData(data)}
    />
  )
}
