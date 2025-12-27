/**
 * RadioGroupControl
 *
 * Enum radio control backed by Mantine Radio.Group.
 *
 * Implementing: https://jsonforms.io/docs/uischema/controls
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/controls/RadioGroupControl.tsx
 * Implementation Notes:
 * - Delegates rendering to `RadioGroupControlBase` for shared layout logic.
 */
import {
  and,
  type ControlProps,
  isEnumControl,
  optionIs,
  type OwnPropsOfEnum,
  type RankedTester,
  rankWith,
} from '@jsonforms/core'
import { withJsonFormsEnumProps } from '@jsonforms/react'
import { RadioGroupControlBase } from '../radio-group/RadioGroup'

export const RadioGroupControl = (props: ControlProps & OwnPropsOfEnum) => {
  return <RadioGroupControlBase {...props} />
}

export const radioGroupControlTester: RankedTester = rankWith(3, and(isEnumControl, optionIs('format', 'radio')))

export default withJsonFormsEnumProps(RadioGroupControl)
