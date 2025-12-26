/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/controls/RadioGroupControl.tsx
- Mantine component: https://mantine.dev/core/radio/
- JsonForms expectations: handles enum controls with format=radio, reads options/labels, and updates the bound value.
- Functionality mapping:
  - options -> Radio.Group data
  - value -> selected radio value
  - onChange -> handleChange path update
  - enabled/visible -> disable or hide group
  - description/errors/label -> use native Mantine functionality
  Implementation approach:
  - Use mantine Radio.Group to implement equivalent of https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/controls/RadioGroup.tsx
  Create shared file 
*/
import { and, isEnumControl, optionIs, type RankedTester, rankWith } from '@jsonforms/core'
import { RadioGroupControl as VanillaRadioGroupControl } from '@jsonforms/vanilla-renderers'

export const RadioGroupControl = VanillaRadioGroupControl

export const radioGroupControlTester: RankedTester = rankWith(3, and(isEnumControl, optionIs('format', 'radio')))

export default RadioGroupControl
