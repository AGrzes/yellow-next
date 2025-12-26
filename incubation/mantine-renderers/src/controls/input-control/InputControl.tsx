/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/controls/InputControl.tsx
- Mantine component: https://mantine.dev/core/input/#input-wrapper
- JsonForms expectations: wraps a selected cell, renders label, description/errors, uses visibility/enabled/required, and selects the best cell based on testers.
- Functionality mapping:
  - label/required -> pass label/required to Mantine cells for native rendering
  - description/errors -> pass description/errors to Mantine cells and respect focus rules
  - enabled/visible -> wrapper disabled/hidden handling
  - cell selection -> keep JsonForms cell dispatch logic
*/
import { type ControlProps, isControl, NOT_APPLICABLE, type RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import type { MantineCellRenderer } from '../../cells/types'

export const InputControl = (props: ControlProps) => {
  const {
    description,
    errors,
    label,
    required,
    uischema,
    schema,
    rootSchema,
    visible,
    enabled,
    path,
    cells,
    config,
    id,
  } = props
  const appliedUiSchemaOptions = Object.assign({}, config, uischema.options)
  const testerContext = { rootSchema, config }
  const availableCells = (cells ?? []) as { tester: RankedTester; cell: MantineCellRenderer }[]
  let bestCell = availableCells[0]
  let bestRank = NOT_APPLICABLE

  for (const entry of availableCells) {
    const rank = entry.tester(uischema, schema, testerContext)
    if (rank > bestRank) {
      bestRank = rank
      bestCell = entry
    }
  }

  if (bestCell === undefined || bestRank === NOT_APPLICABLE) {
    console.warn('No applicable cell found.', uischema, schema)
    return null
  }

  const Cell = bestCell.cell

  return (
    <Cell
      uischema={uischema}
      schema={schema}
      path={path}
      id={`${id}`}
      enabled={enabled}
      visible={visible}
      label={label}
      description={description}
      errors={errors}
      required={required}
      hidden={!visible}
    />
  )
}

export const inputControlTester: RankedTester = rankWith(1, isControl)

export default withJsonFormsControlProps(InputControl)
