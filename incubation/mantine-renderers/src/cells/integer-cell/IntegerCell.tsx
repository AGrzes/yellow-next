/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/IntegerCell.tsx
- Mantine component: https://mantine.dev/core/number-input/
- JsonForms expectations: data is number | undefined, enabled, path, uischema options (focus), and handleChange with an integer value.
- Functionality mapping:
  - value -> NumberInput value
  - onChange -> handleChange(path, integer | undefined)
  - schema.minimum/maximum -> NumberInput min/max
  - integer -> set precision=0 and step=1
  - enabled -> disabled
  - focus option -> autoFocus
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
import { type CellProps, isIntegerControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { NumberInput } from '@mantine/core'

const toInteger = (value: string | number) => {
  if (value === '') {
    return undefined
  }
  if (typeof value === 'number') {
    return Math.floor(value)
  }
  return parseInt(value, 10)
}

export const IntegerCell = (props: CellProps) => {
  const { config, data, enabled, id, uischema, schema, path, handleChange } = props
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

export default withJsonFormsCellProps(IntegerCell)
