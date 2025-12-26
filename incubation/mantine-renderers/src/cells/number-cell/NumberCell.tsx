/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/NumberCell.tsx
- Mantine component: https://mantine.dev/core/number-input/
- JsonForms expectations: data is number | undefined, enabled, path, uischema options (focus), and handleChange with a numeric value.
- Functionality mapping:
  - value -> NumberInput value
  - onChange -> handleChange(path, number | undefined)
  - schema.minimum/maximum -> NumberInput min/max
  - enabled -> disabled
  - focus option -> autoFocus
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
import { type CellProps, isNumberControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { NumberInput } from '@mantine/core'

const toNumberValue = (value: number | string) => {
  if (value === '') {
    return undefined
  }
  return Number(value)
}

export const NumberCell = (props: CellProps) => {
  const { config, data, enabled, id, uischema, schema, path, handleChange } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)

  return (
    <NumberInput
      id={id}
      value={data ?? ''}
      onChange={(value) => handleChange(path, toNumberValue(value))}
      min={schema.minimum}
      max={schema.maximum}
      step={schema.multipleOf ?? 0.1}
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

export default withJsonFormsCellProps(NumberCell)
