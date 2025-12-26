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
  - label/description/errors -> Checkbox props
*/
import { type CellProps, isBooleanControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { Checkbox } from '@mantine/core'
import type { MantineCellsProps } from '../types'

export const BooleanCell = (props: CellProps & MantineCellsProps) => {
  const { config, data, id, enabled, uischema, path, handleChange, label, description, errors, required } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)

  return (
    <Checkbox
      id={id}
      checked={data ?? false}
      label={label}
      description={description}
      error={errors}
      required={required}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      onChange={(event) => handleChange(path, event.currentTarget.checked)}
    />
  )
}

/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
export const booleanCellTester: RankedTester = rankWith(2, isBooleanControl)

export default withJsonFormsCellProps(BooleanCell)
