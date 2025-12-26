import { isControl, type RankedTester, rankWith } from '@jsonforms/core'
import { InputControl as VanillaInputControl } from '@jsonforms/vanilla-renderers'

export const InputControl = VanillaInputControl

export const inputControlTester: RankedTester = rankWith(1, isControl)

export default InputControl
