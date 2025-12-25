/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/DateCell.tsx
- Mantine component: https://mantine.dev/dates/date-input/
- JsonForms expectations: data is a date string (YYYY-MM-DD), enabled, path, uischema options (focus), and handleChange with a string value.
- Functionality mapping:
  - value -> DateInput value
  - onChange -> handleChange(path, date string)
  - enabled -> disabled
  - focus option -> autoFocus
  - empty value -> undefined
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
import type { CellProps } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { DateInput } from '@mantine/dates'

export { dateCellTester } from '@jsonforms/vanilla-renderers'

export const DateCell = (props: CellProps) => {
  const { config, data, id, enabled, uischema, path, handleChange } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)

  return (
    <DateInput
      id={id}
      value={data ?? null}
      onChange={(value) => handleChange(path, value ?? undefined)}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      placeholder={appliedUiSchemaOptions.placeholder}
    />
  )
}

export default withJsonFormsCellProps(DateCell)
