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
import {
  type ControlElement,
  type ControlProps,
  isControl,
  type JsonSchema,
  type RankedTester,
  rankWith,
  type TesterContext,
} from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import type { MantineCellRenderer } from '../../cells/types'

type CellEntry = { tester: RankedTester; cell: MantineCellRenderer }

const getBestCell = (
  cells: CellEntry[],
  uischema: ControlElement,
  schema: JsonSchema,
  testerContext: TesterContext
) => {
  return cells
    .map((entry) => ({ entry, rank: entry.tester(uischema, schema, testerContext) }))
    .filter((candidate) => candidate.rank >= 0)
    .sort((left, right) => right.rank - left.rank)[0]?.entry
}

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
  const testerContext = { rootSchema, config }
  const availableCells = (cells ?? []) as CellEntry[]
  const bestCell = getBestCell(availableCells, uischema, schema, testerContext)

  if (bestCell === undefined) {
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
