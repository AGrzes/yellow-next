import type { RankedTester } from '@jsonforms/core'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'

export const mantineCells: { tester: RankedTester; cell: any }[] = [...vanillaCells]

export const mantineRenderers: { tester: RankedTester; renderer: any }[] = [...vanillaRenderers]
