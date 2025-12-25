/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/TextAreaCell.tsx
- Mantine component: https://mantine.dev/core/textarea/
- JsonForms expectations: data is string | undefined, enabled, path, uischema option multi=true, and optional placeholder/focus.
- Functionality mapping:
  - value -> Textarea value
  - onChange -> handleChange(path, string | undefined)
  - placeholder -> Textarea placeholder
  - focus option -> autoFocus
  - enabled -> disabled
  - empty string -> undefined
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
export { TextAreaCell, textAreaCellTester } from '@jsonforms/vanilla-renderers'
export { TextAreaCell as default } from '@jsonforms/vanilla-renderers'
