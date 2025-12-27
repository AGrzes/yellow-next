/**
 * TextAreaCell
 *
 * Multiline string input cell backed by Mantine Textarea.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/TextAreaCell.tsx
 */
import { type CellProps, isMultiLineControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { Textarea } from '@mantine/core'
import type { MantineCellsProps } from '../types'

export const TextAreaCell = (props: CellProps & MantineCellsProps) => {
  const { config, data, enabled, id, uischema, path, handleChange, label, description, errors, required } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)

  return (
    <Textarea
      id={id}
      value={data ?? ''}
      onChange={(event) => handleChange(path, event.currentTarget.value === '' ? undefined : event.currentTarget.value)}
      disabled={!enabled}
      label={label}
      description={description}
      error={errors}
      required={required}
      autoFocus={appliedUiSchemaOptions.focus}
      placeholder={appliedUiSchemaOptions.placeholder}
    />
  )
}

/**
 * Tester for a multi-line string control.
 * @type {RankedTester}
 */
export const textAreaCellTester: RankedTester = rankWith(2, isMultiLineControl)

export default withJsonFormsCellProps(TextAreaCell)
