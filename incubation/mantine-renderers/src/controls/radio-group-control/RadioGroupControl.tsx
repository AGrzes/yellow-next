import { and, isEnumControl, optionIs, type RankedTester, rankWith } from '@jsonforms/core'
import { RadioGroupControl as VanillaRadioGroupControl } from '@jsonforms/vanilla-renderers'

export const RadioGroupControl = VanillaRadioGroupControl

export const radioGroupControlTester: RankedTester = rankWith(3, and(isEnumControl, optionIs('format', 'radio')))

export default RadioGroupControl
