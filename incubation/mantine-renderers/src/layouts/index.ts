/**
 * Layouts
 *
 * Mantine layout renderer exports for JSONForms.
 * Implementing: https://jsonforms.io/docs/uischema/layouts
 * Includes:
 * - GroupLayout: fieldset-based group layout.
 * - HorizontalLayout: left-to-right layout.
 * - VerticalLayout: top-to-bottom layout.
 */
import GroupLayout, { groupLayoutTester } from './group-layout/GroupLayout'
import HorizontalLayout, { horizontalLayoutTester } from './horizontal-layout/HorizontalLayout'
import VerticalLayout, { verticalLayoutTester } from './vertical-layout/VerticalLayout'

export {
  GroupLayout,
  groupLayoutTester,
  HorizontalLayout,
  horizontalLayoutTester,
  VerticalLayout,
  verticalLayoutTester,
}
