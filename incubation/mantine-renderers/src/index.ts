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
import {
  InputControl,
  inputControlTester,
  OneOfRadioGroupControl,
  oneOfRadioGroupControlTester,
  RadioGroupControl,
  radioGroupControlTester,
} from './controls'

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

const nonControlRenderers = vanillaRenderers.filter(
  (entry) =>
    entry.renderer !== InputControl && entry.renderer !== RadioGroupControl && entry.renderer !== OneOfRadioGroupControl
)

export const mantineRenderers: { tester: RankedTester; renderer: any }[] = [...controlRenderers, ...nonControlRenderers]
