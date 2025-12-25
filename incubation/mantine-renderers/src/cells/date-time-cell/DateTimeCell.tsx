/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/DateTimeCell.tsx
- Mantine component: https://mantine.dev/dates/datetime-picker/
- JsonForms expectations: data is a date-time string (ISO), enabled, path, uischema options (focus), and handleChange with a string value.
- Functionality mapping:
  - value -> DateTimePicker value (convert ISO string to Date)
  - onChange -> handleChange(path, ISO string)
  - enabled -> disabled
  - focus option -> autoFocus
  - empty value -> undefined
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
export { DateTimeCell, dateTimeCellTester } from '@jsonforms/vanilla-renderers'
export { DateTimeCell as default } from '@jsonforms/vanilla-renderers'
