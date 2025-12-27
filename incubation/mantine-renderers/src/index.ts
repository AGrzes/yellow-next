/**
 * Mantine Renderers
 *
 * Entry point exporting Mantine cells and renderer sets for JSONForms.
 * Implementing: https://jsonforms.io/docs/custom-renderers
 * Includes:
 * - mantineCells: Mantine-backed cell renderers with testers.
 * - mantineRenderers: Mantine control/layout/complex renderers.
 * Deviations:
 * - Categorization and NumberFormatCell are intentionally omitted for now.
 */
import type { RankedTester } from '@jsonforms/core'
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
import { ArrayControl, arrayControlTester, TableArrayControl, tableArrayControlTester } from './complex'
import {
  InputControl,
  inputControlTester,
  OneOfRadioGroupControl,
  oneOfRadioGroupControlTester,
  RadioGroupControl,
  radioGroupControlTester,
} from './controls'
import {
  GroupLayout,
  groupLayoutTester,
  HorizontalLayout,
  horizontalLayoutTester,
  VerticalLayout,
  verticalLayoutTester,
} from './layouts'

export const mantineCells: { tester: RankedTester; cell: any }[] = [
  { tester: booleanCellTester, cell: BooleanCell },
  { tester: dateCellTester, cell: DateCell },
  { tester: dateTimeCellTester, cell: DateTimeCell },
  { tester: enumCellTester, cell: EnumCell },
  { tester: integerCellTester, cell: IntegerCell },
  { tester: numberCellTester, cell: NumberCell },
  { tester: oneOfEnumCellTester, cell: OneOfEnumCell },
  { tester: sliderCellTester, cell: SliderCell },
  { tester: textAreaCellTester, cell: TextAreaCell },
  { tester: textCellTester, cell: TextCell },
  { tester: timeCellTester, cell: TimeCell },
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

export const mantineRenderers: { tester: RankedTester; renderer: any }[] = [
  ...controlRenderers,
  ...layoutRenderers,
  ...complexRenderers,
]
