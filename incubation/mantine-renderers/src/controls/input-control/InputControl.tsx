/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/controls/InputControl.tsx
- Mantine component: https://mantine.dev/core/input/#input-wrapper
- JsonForms expectations: wraps a selected cell, renders label, description/errors, uses visibility/enabled/required, and selects the best cell based on testers.
- Functionality mapping:
  - label/required -> Enhance Mantine Cells with props that allow passing label and implement using native Mantine 
  - description/errors -> Enhance Mantine Cells with props that allow passing error/required and implement using native Mantine
  - enabled/visible -> wrapper disabled/hidden handling
  - cell selection -> keep JsonForms cell dispatch logic
*/
import { isControl, type RankedTester, rankWith } from '@jsonforms/core'
import { InputControl as VanillaInputControl } from '@jsonforms/vanilla-renderers'

export const InputControl = VanillaInputControl

export const inputControlTester: RankedTester = rankWith(1, isControl)

export default InputControl
