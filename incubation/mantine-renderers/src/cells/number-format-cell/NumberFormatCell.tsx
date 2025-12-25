/*
SKIP FOR NOW
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/NumberFormatCell.tsx
- Mantine component: https://mantine.dev/core/number-input/
- JsonForms expectations: data is number | undefined, enabled, path, uischema option format=true, and props include toFormatted/fromFormatted.
- Functionality mapping:
  - value -> NumberInput value (string format)
  - toFormatted -> NumberInput formatter (wrangling)
  - fromFormatted -> NumberInput parser (wrangling)
  - onChange -> handleChange(path, parsed number | undefined)
  - enabled -> disabled
  - focus option -> autoFocus
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
export { NumberFormatCell as default, NumberFormatCell, numberFormatCellTester } from '@jsonforms/vanilla-renderers'
