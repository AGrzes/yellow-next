/**
 * Mantine Renderers
 *
 * Entry point exporting Mantine cells and renderer sets for JSONForms.
 * Implementing: https://jsonforms.io/docs/custom-renderers
 * Includes:
 * - mantineCells: Mantine-backed cell renderers with testers.
 * - mantineRenderers: Mantine control/layout/complex renderers plus vanilla fallbacks.
 * Deviations:
 * - Falls back to vanilla renderers for unimplemented renderer types.
 */
import type { RankedTester } from '@jsonforms/core'
import { vanillaRenderers } from '@jsonforms/vanilla-renderers'
import {
  BooleanCell,
  booleanCellTester,
  DateCell,
  dateCellTester,
  DateTimeCell,
  dateTimeCellTester,
  EnumCell,
  enumCellTester,
  IntegerCell,
  integerCellTester,
  NumberCell,
  numberCellTester,
  OneOfEnumCell,
  oneOfEnumCellTester,
  SliderCell,
  sliderCellTester,
  TextAreaCell,
  textAreaCellTester,
  TextCell,
  textCellTester,
  TimeCell,
  timeCellTester,
} from './cells'
import type { MantineCellRenderer } from './cells/types'
import {
  InputControl,
  inputControlTester,
  OneOfRadioGroupControl,
  oneOfRadioGroupControlTester,
  RadioGroupControl,
  radioGroupControlTester,
} from './controls'
import {
  ArrayControl,
  arrayControlTester,
  TableArrayControl,
  tableArrayControlTester,
} from './complex'
import {
  GroupLayout,
  groupLayoutTester,
  HorizontalLayout,
  horizontalLayoutTester,
  VerticalLayout,
  verticalLayoutTester,
} from './layouts'

type MantineCellEntry = { tester: RankedTester; cell: MantineCellRenderer }
const asMantineCell = (cell: unknown) => cell as MantineCellRenderer

export const mantineCells: MantineCellEntry[] = [
  { tester: booleanCellTester, cell: asMantineCell(BooleanCell) },
  { tester: dateCellTester, cell: asMantineCell(DateCell) },
  { tester: dateTimeCellTester, cell: asMantineCell(DateTimeCell) },
  { tester: enumCellTester, cell: asMantineCell(EnumCell) },
  { tester: integerCellTester, cell: asMantineCell(IntegerCell) },
  { tester: numberCellTester, cell: asMantineCell(NumberCell) },
  { tester: oneOfEnumCellTester, cell: asMantineCell(OneOfEnumCell) },
  { tester: sliderCellTester, cell: asMantineCell(SliderCell) },
  { tester: textAreaCellTester, cell: asMantineCell(TextAreaCell) },
  { tester: textCellTester, cell: asMantineCell(TextCell) },
  { tester: timeCellTester, cell: asMantineCell(TimeCell) },
]

const controlRenderers: { tester: RankedTester; renderer: any }[] = [
  { tester: inputControlTester, renderer: InputControl },
  { tester: radioGroupControlTester, renderer: RadioGroupControl },
  { tester: oneOfRadioGroupControlTester, renderer: OneOfRadioGroupControl },
]

const layoutRenderers: { tester: RankedTester; renderer: any }[] = [
  { tester: groupLayoutTester, renderer: GroupLayout },
  { tester: horizontalLayoutTester, renderer: HorizontalLayout },
  { tester: verticalLayoutTester, renderer: VerticalLayout },
]

const complexRenderers: { tester: RankedTester; renderer: any }[] = [
  { tester: arrayControlTester, renderer: ArrayControl },
  { tester: tableArrayControlTester, renderer: TableArrayControl },
]

const nonControlRenderers = vanillaRenderers.filter(
  (entry) =>
    entry.renderer !== InputControl &&
    entry.renderer !== RadioGroupControl &&
    entry.renderer !== OneOfRadioGroupControl &&
    entry.renderer !== GroupLayout &&
    entry.renderer !== HorizontalLayout &&
    entry.renderer !== VerticalLayout &&
    entry.renderer !== ArrayControl &&
    entry.renderer !== TableArrayControl
)

export const mantineRenderers: { tester: RankedTester; renderer: any }[] = [
  ...controlRenderers,
  ...layoutRenderers,
  ...complexRenderers,
  ...nonControlRenderers,
]
