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
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
import type { CellProps } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { TimeInput } from '@mantine/dates'

export { timeCellTester } from '@jsonforms/vanilla-renderers'

export const TimeCell = (props: CellProps) => {
  const { config, data, enabled, id, uischema, path, handleChange } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)

  return (
    <TimeInput
      id={id}
      value={data ?? ''}
      onChange={(event) => handleChange(path, event.currentTarget.value || undefined)}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      withSeconds
    />
  )
}

export default withJsonFormsCellProps(TimeCell)
