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
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
import { type CellProps, isRangeControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { Slider } from '@mantine/core'

export const SliderCell = (props: CellProps) => {
  const { data, enabled, id, schema, path, handleChange } = props
  const fallbackValue = schema.default ?? schema.minimum ?? 0

  return (
    <Slider
      id={id}
      value={data ?? fallbackValue}
      onChange={(value) => handleChange(path, value)}
      min={schema.minimum}
      max={schema.maximum}
      step={schema.multipleOf ?? 1}
      disabled={!enabled}
    />
  )
}

/**
 * Default tester for range controls.
 * @type {RankedTester}
 */
export const sliderCellTester: RankedTester = rankWith(4, isRangeControl)

export default withJsonFormsCellProps(SliderCell)
