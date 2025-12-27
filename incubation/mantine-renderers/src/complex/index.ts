/**
 * Complex
 *
 * Mantine complex renderers for array-based controls.
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Includes:
 * - ArrayControl: nested object array renderer.
 * - TableArrayControl: table layout array renderer.
 * Deviations:
 * - Array remove actions are immediate (no confirmation dialog).
 * - TableArrayControl omits the status/error column.
 */
import ArrayControl, { arrayControlTester } from './array-control/ArrayControl'
import TableArrayControl, { tableArrayControlTester } from './table-array-control/TableArrayControl'

export {
  ArrayControl,
  arrayControlTester,
  TableArrayControl,
  tableArrayControlTester,
}
