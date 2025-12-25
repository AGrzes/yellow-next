/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/TimeCell.tsx
- Mantine component: https://mantine.dev/dates/time-input/
- JsonForms expectations: data is a time string (HH:mm:ss), enabled, path, uischema options (focus), and handleChange with a string value.
- Functionality mapping:
  - value -> TimeInput value (string or Date, convert as needed)
  - onChange -> handleChange(path, time string)
  - enabled -> disabled
  - focus option -> autoFocus
  - empty value -> undefined
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
export { TimeCell, timeCellTester } from '@jsonforms/vanilla-renderers'
export { TimeCell as default } from '@jsonforms/vanilla-renderers'
