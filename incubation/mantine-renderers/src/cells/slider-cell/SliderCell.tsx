/**
 * SliderCell
 *
 * Range input cell backed by Mantine Slider.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/SliderCell.tsx
 * Implementation Notes:
 * - Falls back to `schema.default`, then `schema.minimum`, then 0 when data is undefined.
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

const _default: ReturnType<typeof withJsonFormsCellProps> = withJsonFormsCellProps(SliderCell)
export default _default
