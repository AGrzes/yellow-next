/*
Implementation notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/cells/SliderCell.tsx
- Mantine component: https://mantine.dev/core/slider/
- JsonForms expectations: data is number | undefined, enabled, path, uischema option slider=true, and schema has min/max/default.
- Functionality mapping:
  - value -> Slider value (fallback to schema.default)
  - schema.minimum/maximum -> Slider min/max
  - onChange -> handleChange(path, number)
  - enabled -> disabled
  - focus option -> autoFocus (may require focus handling)
  - visibility/label/errors -> handled by control wrapper, not the cell
*/
export { SliderCell, sliderCellTester } from '@jsonforms/vanilla-renderers'
export { SliderCell as default } from '@jsonforms/vanilla-renderers'
