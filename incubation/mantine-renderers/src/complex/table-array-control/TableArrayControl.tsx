/*
Planning notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/complex/TableArrayControl.tsx
- Mantine components to use:
  - Table for rows/cells
  - Group + Button/ActionIcon for add/remove
  - Badge/Text for validation status
  - ScrollArea for wide tables
- JsonForms expectations to keep:
  - object + primitive array handling (table layout)
  - DispatchCell for each cell rendering
  - add/remove with array control props
  - label/description/errors/visibility/enabled handling
- Vanilla behaviors to skip/simplify:
  - default confirm dialog (direct remove)
  - vanilla className styling hooks
  - per-cell error summary string concatenation (show aggregate error column instead)
- Component split proposal:
  - TableArrayHeader (label + add button)
  - TableArrayRow (DispatchCell row)
  - TableArrayActions (remove button)
  - TableArrayStatus (row validation)
  - TableArrayEmptyState
- Shared helpers:
  - getRowSchema(schema, rootSchema)
  - getColumnDefinitions(schema, rootSchema)
  - buildRowPath(path, index)
*/
import { isObjectArrayControl, isPrimitiveArrayControl, or, type RankedTester, rankWith } from '@jsonforms/core'
import { TableArrayControl as VanillaTableArrayControl } from '@jsonforms/vanilla-renderers'

export const TableArrayControl = VanillaTableArrayControl

export const tableArrayControlTester: RankedTester = rankWith(
  3,
  or(isObjectArrayControl, isPrimitiveArrayControl)
)

export default TableArrayControl
