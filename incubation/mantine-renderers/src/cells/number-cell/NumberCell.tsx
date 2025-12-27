/**
 * NumberCell
 *
 * Numeric input cell backed by Mantine NumberInput.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/NumberCell.tsx
 * Implementation Notes:
 * - Uses `schema.multipleOf` as the step value with a 0.1 fallback.
 */
import { type CellProps, isNumberControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { NumberInput } from '@mantine/core'
import type { MantineCellsProps } from '../types'

const toNumberValue = (value: number | string) => {
  if (value === '') {
    return undefined
  }
  return Number(value)
}

export const NumberCell = (props: CellProps & MantineCellsProps) => {
  const { config, data, enabled, id, uischema, schema, path, handleChange, label, description, errors, required } =
    props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)

  return (
    <NumberInput
      id={id}
      value={data ?? ''}
      onChange={(value) => handleChange(path, toNumberValue(value))}
      min={schema.minimum}
      max={schema.maximum}
      step={schema.multipleOf ?? 0.1}
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
 * Default tester for number controls.
 * @type {RankedTester}
 */
export const numberCellTester: RankedTester = rankWith(2, isNumberControl)

const _default: ReturnType<typeof withJsonFormsCellProps> = withJsonFormsCellProps(NumberCell)
export default _default
