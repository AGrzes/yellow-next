import { type RankedTester, rankWith, uiTypeIs } from '@jsonforms/core'
import { VerticalLayout as VanillaVerticalLayout } from '@jsonforms/vanilla-renderers'

export const VerticalLayout = VanillaVerticalLayout

export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'))

export default VerticalLayout
