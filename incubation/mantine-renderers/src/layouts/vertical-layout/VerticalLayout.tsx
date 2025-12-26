/*
Design notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/layouts/VerticalLayout.tsx
- Mantine component: https://mantine.dev/core/stack/
- JsonForms expectations: renders a VerticalLayout with children top-to-bottom, respects visibility/enabled.
- Functionality mapping:
  - children -> Stack with spacing
  - visibility/enabled -> wrapper hidden/disabled handling
  - child rendering -> JsonForms renderChildren equivalent
*/
import { type RankedTester, rankWith, uiTypeIs } from '@jsonforms/core'
import { VerticalLayout as VanillaVerticalLayout } from '@jsonforms/vanilla-renderers'

export const VerticalLayout = VanillaVerticalLayout

export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'))

export default VerticalLayout
