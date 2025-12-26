import { type RankedTester, rankWith, uiTypeIs } from '@jsonforms/core'
import { GroupLayout as VanillaGroupLayout } from '@jsonforms/vanilla-renderers'

export const GroupLayout = VanillaGroupLayout

export const groupLayoutTester: RankedTester = rankWith(1, uiTypeIs('Group'))

export default GroupLayout
