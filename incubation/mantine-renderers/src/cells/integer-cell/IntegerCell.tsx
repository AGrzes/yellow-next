/**
 * IntegerCell
 *
 * Integer input cell backed by Mantine NumberInput.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/IntegerCell.tsx
 * Implementation Notes:
 * - Uses `allowDecimal={false}` with a step fallback of 1.
 */
import { type CellProps, isIntegerControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { NumberInput } from '@mantine/core'
import type { MantineCellsProps } from '../types'

const toInteger = (value: string | number) => {
  if (value === '') {
    return undefined
  }
  if (typeof value === 'number') {
    return Math.floor(value)
  }
  return parseInt(value, 10)
}

export const IntegerCell = (props: CellProps & MantineCellsProps) => {
  const { config, data, enabled, id, uischema, schema, path, handleChange, label, description, errors, required } =
    props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)

  return (
    <NumberInput
      id={id}
      value={data ?? ''}
      onChange={(value) => handleChange(path, toInteger(value))}
      min={schema.minimum}
      max={schema.maximum}
      step={schema.multipleOf ?? 1}
      allowDecimal={false}
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
 * Default tester for integer controls.
 * @type {RankedTester}
 */
export const integerCellTester: RankedTester = rankWith(2, isIntegerControl)

const _default: ReturnType<typeof withJsonFormsCellProps> = withJsonFormsCellProps(IntegerCell)
export default _default
