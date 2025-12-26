import { type CellProps, isStringControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { TextInput } from '@mantine/core'
import type { MantineCellsProps } from '../types'

export const TextCell = (props: CellProps & MantineCellsProps) => {
  const { config, data, id, enabled, uischema, schema, path, handleChange, label, description, errors, required } =
    props
  const maxLength = schema.maxLength
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)
  return (
    <TextInput
      type={appliedUiSchemaOptions.format === 'password' ? 'password' : 'text'}
      value={data || ''}
      onChange={(ev) => handleChange(path, ev.target.value === '' ? undefined : ev.target.value)}
      id={id}
      label={label}
      description={description}
      error={errors}
      required={required}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      placeholder={appliedUiSchemaOptions.placeholder}
      maxLength={maxLength}
    />
  )
}

/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textCellTester: RankedTester = rankWith(1, isStringControl)

export default withJsonFormsCellProps(TextCell)
