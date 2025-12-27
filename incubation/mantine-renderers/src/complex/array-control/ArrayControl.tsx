import { isObjectArrayWithNesting, type RankedTester, rankWith } from '@jsonforms/core'
import { ArrayControl as VanillaArrayControl } from '@jsonforms/vanilla-renderers'

export const ArrayControl = VanillaArrayControl

export const arrayControlTester: RankedTester = rankWith(4, isObjectArrayWithNesting)

export default ArrayControl
