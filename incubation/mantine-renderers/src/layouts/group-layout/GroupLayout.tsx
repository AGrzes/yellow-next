/*
Design notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/layouts/GroupLayout.tsx
- Mantine components: https://mantine.dev/core/fieldset/ and https://mantine.dev/core/stack/
- JsonForms expectations: renders a Group layout with optional label, respects visibility/enabled, and renders child elements in order.
- Functionality mapping:
  - label -> Fieldset legend (use Mantine Fieldset)
  - child layout -> Stack for vertical spacing
  - visibility/enabled -> Fieldset disabled + hidden handling
  - child rendering -> JsonForms renderChildren equivalent
*/
import { type RankedTester, rankWith, uiTypeIs } from '@jsonforms/core'
import { GroupLayout as VanillaGroupLayout } from '@jsonforms/vanilla-renderers'

export const GroupLayout = VanillaGroupLayout

export const groupLayoutTester: RankedTester = rankWith(1, uiTypeIs('Group'))

export default GroupLayout
