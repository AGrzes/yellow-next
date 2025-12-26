/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/controls/OneOfRadioGroupControl.tsx
- Mantine component: https://mantine.dev/core/radio/
- JsonForms expectations: handles oneOf enum controls with format=radio, reads oneOf options, and updates the bound value.
- Functionality mapping:
  - oneOf options -> Radio.Group data
  - value -> selected radio value
  - onChange -> handleChange path update
  - enabled/visible -> disable or hide group
  - description/errors/label -> use native Mantine functionality
  Implementation approach:
  - Use mantine Radio.Group to implement equivalent of https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/controls/RadioGroup.tsx
  Create shared file 
*/
import {
  and,
  type ControlProps,
  isOneOfEnumControl,
  optionIs,
  type OwnPropsOfEnum,
  type RankedTester,
  rankWith,
} from '@jsonforms/core'
import { withJsonFormsOneOfEnumProps } from '@jsonforms/react'
import { RadioGroupControlBase } from '../radio-group/RadioGroup'

export const OneOfRadioGroupControl = (props: ControlProps & OwnPropsOfEnum) => {
  return <RadioGroupControlBase {...props} />
}

export const oneOfRadioGroupControlTester: RankedTester = rankWith(
  3,
  and(isOneOfEnumControl, optionIs('format', 'radio'))
)

export default withJsonFormsOneOfEnumProps(OneOfRadioGroupControl)
