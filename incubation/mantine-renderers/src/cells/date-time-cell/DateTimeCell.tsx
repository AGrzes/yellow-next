/**
 * DateTimeCell
 *
 * Date-time input cell backed by Mantine DateTimePicker.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/DateTimeCell.tsx
 * Implementation Notes:
 * - Normalizes the picker value to an ISO-like string via `toIsoDateTime`.
 */
import { type CellProps, isDateTimeControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { DateTimePicker } from '@mantine/dates'
import type { MantineCellsProps } from '../types'

const toIsoDateTime = (value: string | null) => {
  if (!value) {
    return undefined
  } else {
    return value.slice(0, 10) + 'T' + value.slice(11)
  }
}

export const DateTimeCell = (props: CellProps & MantineCellsProps) => {
  const { config, data, enabled, id, uischema, path, handleChange, label, description, errors, required } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)

  return (
    <DateTimePicker
      id={id}
      value={data ?? null}
      onChange={(value) => handleChange(path, toIsoDateTime(value))}
      label={label}
      description={description}
      error={errors}
      required={required}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      placeholder={appliedUiSchemaOptions.placeholder}
      withSeconds
    />
  )
}

/**
 * Default tester for datetime controls.
 * @type {RankedTester}
 */
export const dateTimeCellTester: RankedTester = rankWith(2, isDateTimeControl)

export default withJsonFormsCellProps(DateTimeCell)
