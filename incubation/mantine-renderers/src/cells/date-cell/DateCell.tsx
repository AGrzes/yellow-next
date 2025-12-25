/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/DateCell.tsx
- Mantine component: https://mantine.dev/dates/date-input/
- JsonForms expectations: data is a date string (YYYY-MM-DD), enabled, path, uischema options (focus), and handleChange with a string value.
- Functionality mapping:
  - value -> DateInput value (convert string to Date)
  - onChange -> handleChange(path, formatted date string)
  - enabled -> disabled
  - focus option -> autoFocus
  - empty value -> undefined
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
export { DateCell, dateCellTester } from '@jsonforms/vanilla-renderers'
export { DateCell as default } from '@jsonforms/vanilla-renderers'
