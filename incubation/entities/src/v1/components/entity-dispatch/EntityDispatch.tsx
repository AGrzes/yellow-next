import {
  NOT_APPLICABLE,
  type ControlProps,
  type JsonSchema,
  type TesterContext,
  type UISchemaElement,
} from '@jsonforms/core'
import { JsonFormsDispatch, withJsonFormsControlProps } from '@jsonforms/react'
import type { Entity } from '@v1/entity'

export function EntityDispatch(props: ControlProps) {
  const entity = props.data as Entity<any>
  return <JsonFormsDispatch {...props} schema={entity.meta?.type?.schema} path={`${props.path}/data`} />
}

export const EntityDispatchTester = (uischema: UISchemaElement, schema: JsonSchema, _context: TesterContext) => {
  console.log('EntityDispatchTester', { uischema, schema, _context })
  if (schema.entity === true && !!uischema) {
    return 10
  }
  return NOT_APPLICABLE
}
const _default: ReturnType<typeof withJsonFormsControlProps> = withJsonFormsControlProps(EntityDispatch)
export default _default
