/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/DateTimeCell.tsx
- Mantine component: https://mantine.dev/dates/datetime-picker/
- JsonForms expectations: data is a date-time string (ISO), enabled, path, uischema options (focus), and handleChange with a string value.
- Functionality mapping:
  - value -> DateTimePicker value
  - onChange -> handleChange(path, ISO string)
  - enabled -> disabled
  - focus option -> autoFocus
  - empty value -> undefined
  - label/description/errors -> DateTimePicker props
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
