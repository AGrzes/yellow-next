/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/BooleanCell.tsx
- Mantine component: https://mantine.dev/core/checkbox/
- JsonForms expectations: uses data (boolean | undefined), enabled, path, uischema options (focus), and calls handleChange with the new boolean value.
- Functionality mapping:
  - value -> Checkbox checked
  - undefined -> unchecked
  - onChange -> handleChange(path, checked)
  - enabled -> disabled
  - focus option -> autoFocus
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
import type { CellProps } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { Checkbox } from '@mantine/core'

export { booleanCellTester } from '@jsonforms/vanilla-renderers'

export const BooleanCell = (props: CellProps) => {
  const { config, data, id, enabled, uischema, path, handleChange } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)

  return (
    <Checkbox
      id={id}
      checked={data ?? false}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      onChange={(event) => handleChange(path, event.currentTarget.checked)}
    />
  )
}

export default withJsonFormsCellProps(BooleanCell)
