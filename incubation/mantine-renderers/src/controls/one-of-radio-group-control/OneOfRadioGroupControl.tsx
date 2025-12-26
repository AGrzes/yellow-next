import { and, isOneOfEnumControl, optionIs, type RankedTester, rankWith } from '@jsonforms/core'
import { OneOfRadioGroupControl as VanillaOneOfRadioGroupControl } from '@jsonforms/vanilla-renderers'

export const OneOfRadioGroupControl = VanillaOneOfRadioGroupControl

export const oneOfRadioGroupControlTester: RankedTester = rankWith(
  3,
  and(isOneOfEnumControl, optionIs('format', 'radio'))
)

export default OneOfRadioGroupControl
