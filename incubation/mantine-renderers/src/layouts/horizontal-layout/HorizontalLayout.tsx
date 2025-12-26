/*
Design notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/layouts/HorizontalLayout.tsx
- Mantine component: https://mantine.dev/core/group/
- JsonForms expectations: renders a HorizontalLayout with children ordered left-to-right, respects visibility/enabled.
- Functionality mapping:
  - children -> Group with spacing
  - visibility/enabled -> wrapper hidden/disabled handling
  - child rendering -> JsonForms renderChildren equivalent
*/
import { type RankedTester, rankWith, uiTypeIs } from '@jsonforms/core'
import { HorizontalLayout as VanillaHorizontalLayout } from '@jsonforms/vanilla-renderers'

export const HorizontalLayout = VanillaHorizontalLayout

export const horizontalLayoutTester: RankedTester = rankWith(1, uiTypeIs('HorizontalLayout'))

export default HorizontalLayout
