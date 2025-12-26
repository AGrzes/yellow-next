/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/TimeCell.tsx
- Mantine component: https://mantine.dev/dates/time-input/
- JsonForms expectations: data is a time string (HH:mm:ss), enabled, path, uischema options (focus), and handleChange with a string value.
- Functionality mapping:
  - value -> TimeInput value
  - onChange -> handleChange(path, time string)
  - enabled -> disabled
  - focus option -> autoFocus
  - empty value -> undefined
  - label/description/errors -> TimeInput props
*/
import { type CellProps, isTimeControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { TimeInput } from '@mantine/dates'
import type { MantineCellsProps } from '../types'

export const TimeCell = (props: CellProps & MantineCellsProps) => {
  const { config, data, enabled, id, uischema, path, handleChange, label, description, errors, required } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)

  return (
    <TimeInput
      id={id}
      value={data ?? ''}
      onChange={(event) => handleChange(path, event.currentTarget.value || undefined)}
      label={label}
      description={description}
      error={errors}
      required={required}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      withSeconds
    />
  )
}

/**
 * Default tester for time controls.
 * @type {RankedTester}
 */
export const timeCellTester: RankedTester = rankWith(2, isTimeControl)

export default withJsonFormsCellProps(TimeCell)
