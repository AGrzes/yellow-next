/**
 * OneOfRadioGroupControl
 *
 * OneOf enum radio control backed by Mantine Radio.Group.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/controls/OneOfRadioGroupControl.tsx
 * Implementation Notes:
 * - Delegates rendering to `RadioGroupControlBase` for shared layout logic.
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
