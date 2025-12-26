/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/TextAreaCell.tsx
- Mantine component: https://mantine.dev/core/textarea/
- JsonForms expectations: data is string | undefined, enabled, path, uischema option multi=true, and optional placeholder/focus.
- Functionality mapping:
  - value -> Textarea value
  - onChange -> handleChange(path, string | undefined)
  - placeholder -> Textarea placeholder
  - focus option -> autoFocus
  - enabled -> disabled
  - empty string -> undefined
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
import { type CellProps, isMultiLineControl, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsCellProps } from '@jsonforms/react'
import { Textarea } from '@mantine/core'

export const TextAreaCell = (props: CellProps) => {
  const { config, data, enabled, id, uischema, path, handleChange } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)

  return (
    <Textarea
      id={id}
      value={data ?? ''}
      onChange={(event) =>
        handleChange(path, event.currentTarget.value === '' ? undefined : event.currentTarget.value)
      }
      disabled={!enabled}
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
