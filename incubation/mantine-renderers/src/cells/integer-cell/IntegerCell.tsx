/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/IntegerCell.tsx
- Mantine component: https://mantine.dev/core/number-input/
- JsonForms expectations: data is number | undefined, enabled, path, uischema options (focus), and handleChange with an integer value.
- Functionality mapping:
  - value -> NumberInput value
  - onChange -> handleChange(path, integer | undefined)
  - schema.minimum/maximum -> NumberInput min/max
  - integer -> set precision=0 and step=1
  - enabled -> disabled
  - focus option -> autoFocus
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
export { IntegerCell as default, IntegerCell, integerCellTester } from '@jsonforms/vanilla-renderers'
