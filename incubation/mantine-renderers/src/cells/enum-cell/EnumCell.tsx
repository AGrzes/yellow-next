/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/EnumCell.tsx
- Mantine component: https://mantine.dev/core/select/
- JsonForms expectations: receives options (label/value), data (string | undefined), enabled, path, and uischema options (focus).
- Functionality mapping:
  - value -> Select value
  - options -> Select data (map { label, value })
  - clear -> handleChange(path, undefined) (use clearable or explicit empty option)
  - enabled -> disabled
  - focus option -> autoFocus
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
export { EnumCell, enumCellTester } from '@jsonforms/vanilla-renderers'
export { EnumCell as default } from '@jsonforms/vanilla-renderers'
