/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/BooleanCell.tsx
- Mantine component: https://mantine.dev/core/checkbox/
- JsonForms expectations: uses data (boolean | undefined), enabled, path, uischema options (focus), and calls handleChange with the new boolean value.
- Functionality mapping:
  - value -> Checkbox checked
  - undefined -> unchecked
  - onChange -> handleChange(path, checked)
  - enabled -> disabled
  - focus option -> autoFocus
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
export { BooleanCell, booleanCellTester } from '@jsonforms/vanilla-renderers'
export { BooleanCell as default } from '@jsonforms/vanilla-renderers'
