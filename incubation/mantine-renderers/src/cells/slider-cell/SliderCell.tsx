/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/SliderCell.tsx
- Mantine component: https://mantine.dev/core/slider/
- JsonForms expectations: data is number | undefined, enabled, path, uischema option slider=true, and schema has min/max/default.
- Functionality mapping:
  - value -> Slider value (fallback to schema.default)
  - schema.minimum/maximum -> Slider min/max
  - onChange -> handleChange(path, number)
  - enabled -> disabled
  - focus option -> autoFocus (may require focus handling)
  - label/description/errors -> Input.Wrapper props
*/
import { type CellProps, isRangeControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { Input, Slider } from '@mantine/core'
import type { MantineCellsProps } from '../types'

export const SliderCell = (props: CellProps & MantineCellsProps) => {
  const { data, enabled, id, schema, path, handleChange, label, description, errors, required } = props
  const fallbackValue = schema.default ?? schema.minimum ?? 0

  return (
    <Input.Wrapper id={id} label={label} description={description} error={errors} required={required}>
      <Slider
        id={id}
        value={data ?? fallbackValue}
        onChange={(value) => handleChange(path, value)}
        min={schema.minimum}
        max={schema.maximum}
        step={schema.multipleOf ?? 1}
        disabled={!enabled}
      />
    </Input.Wrapper>
  )
}

/**
 * Default tester for range controls.
 * @type {RankedTester}
 */
export const sliderCellTester: RankedTester = rankWith(4, isRangeControl)

export default withJsonFormsCellProps(SliderCell)
