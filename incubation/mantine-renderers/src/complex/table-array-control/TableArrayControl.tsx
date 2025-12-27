import { isObjectArrayControl, isPrimitiveArrayControl, or, type RankedTester, rankWith } from '@jsonforms/core'
import { TableArrayControl as VanillaTableArrayControl } from '@jsonforms/vanilla-renderers'

export const TableArrayControl = VanillaTableArrayControl

export const tableArrayControlTester: RankedTester = rankWith(
  3,
  or(isObjectArrayControl, isPrimitiveArrayControl)
)

export default TableArrayControl
