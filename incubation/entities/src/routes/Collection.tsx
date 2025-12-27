import { mantineCells, mantineRenderers } from '@agrzes/mantine-renderers'
import { JsonForms } from '@jsonforms/react'
import { useLoaderData, type LoaderFunction } from 'react-router'
import { entityManager, schemaManager, uiSchemaManager } from '../service/index.ts'

type CollectionLoaderData = {
  schema: any
  uiSchema: any
  items: any[]
}

export function Collection() {
  const { schema, uiSchema, items } = useLoaderData() as CollectionLoaderData

  return (
    <JsonForms schema={schema} uischema={uiSchema} data={items} renderers={mantineRenderers} cells={mantineCells} />
  )
}

export const collectionLoader: LoaderFunction = async () => {
  const [schema, uiSchema, data] = await Promise.all([
    schemaManager.getSchema('book'),
    uiSchemaManager.getUiSchema('book', 'collection'),
    entityManager.list('book'),
  ])
  const itemSchema = (schema as any).items ?? schema
  console.log('collectionLoader', { schema: itemSchema, uiSchema, data })
  return { schema: itemSchema, uiSchema, items: data }
}
