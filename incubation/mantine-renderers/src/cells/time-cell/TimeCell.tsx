/**
 * TimeCell
 *
 * Time input cell backed by Mantine TimeInput.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/TimeCell.tsx
 */
import { type CellProps, isTimeControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { TimeInput } from '@mantine/dates'
import type { MantineCellsProps } from '../types'

export const TimeCell = (props: CellProps & MantineCellsProps) => {
  const { config, data, enabled, id, uischema, path, handleChange, label, description, errors, required } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)

  return (
    <TimeInput
      id={id}
      value={data ?? ''}
      onChange={(event) => handleChange(path, event.currentTarget.value || undefined)}
      label={label}
      description={description}
      error={errors}
      required={required}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      withSeconds
    />
  )
}

/**
 * Default tester for time controls.
 * @type {RankedTester}
 */
export const timeCellTester: RankedTester = rankWith(2, isTimeControl)

const _default: ReturnType<typeof withJsonFormsCellProps> = withJsonFormsCellProps(TimeCell)
export default _default
