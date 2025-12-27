/**
 * BooleanCell
 *
 * Boolean input cell backed by Mantine Checkbox.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/BooleanCell.tsx
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
