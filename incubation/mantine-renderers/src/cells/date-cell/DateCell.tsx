/**
 * DateCell
 *
 * Date input cell backed by Mantine DateInput.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/DateCell.tsx
 */
import { type CellProps, isDateControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { DateInput } from '@mantine/dates'
import type { MantineCellsProps } from '../types'

export const DateCell = (props: CellProps & MantineCellsProps) => {
  const { config, data, id, enabled, uischema, path, handleChange, label, description, errors, required } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)

  return (
    <DateInput
      id={id}
      value={data ?? null}
      onChange={(value) => handleChange(path, value ?? undefined)}
      label={label}
      description={description}
      error={errors}
      required={required}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      placeholder={appliedUiSchemaOptions.placeholder}
    />
  )
}

/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export const dateCellTester: RankedTester = rankWith(2, isDateControl)

export default withJsonFormsCellProps(DateCell)
