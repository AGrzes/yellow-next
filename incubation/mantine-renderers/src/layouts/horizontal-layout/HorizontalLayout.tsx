import { type RankedTester, rankWith, uiTypeIs } from '@jsonforms/core'
import { HorizontalLayout as VanillaHorizontalLayout } from '@jsonforms/vanilla-renderers'

export const HorizontalLayout = VanillaHorizontalLayout

export const horizontalLayoutTester: RankedTester = rankWith(1, uiTypeIs('HorizontalLayout'))

export default HorizontalLayout
