/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/NumberCell.tsx
- Mantine component: https://mantine.dev/core/number-input/
- JsonForms expectations: data is number | undefined, enabled, path, uischema options (focus), and handleChange with a numeric value.
- Functionality mapping:
  - value -> NumberInput value
  - onChange -> handleChange(path, number | undefined)
  - schema.minimum/maximum -> NumberInput min/max
  - enabled -> disabled
  - focus option -> autoFocus
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
export { NumberCell as default, NumberCell, numberCellTester } from '@jsonforms/vanilla-renderers'
