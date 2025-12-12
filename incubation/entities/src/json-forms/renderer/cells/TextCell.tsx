import { type CellProps, isStringControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { TextInput } from '@mantine/core'

export const TextCell = (props: CellProps) => {
  const { config, data, id, enabled, uischema, schema, path, handleChange } = props
  const maxLength = schema.maxLength
  const appliedUiSchemaOptions = { ...config, ...uischema.options }
  return (
    <TextInput
      type={appliedUiSchemaOptions.format === 'password' ? 'password' : 'text'}
      value={data || ''}
      onChange={(ev) => handleChange(path, ev.target.value === '' ? undefined : ev.target.value)}
      id={id}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      placeholder={appliedUiSchemaOptions.placeholder}
      maxLength={appliedUiSchemaOptions.restrict ? maxLength : undefined}
      max={appliedUiSchemaOptions.trim ? maxLength : undefined}
    />
  )
}

/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textCellTester: RankedTester = rankWith(2, isStringControl)

export default withJsonFormsCellProps(TextCell)
