/*
Planning notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/complex/array/ArrayControlRenderer.tsx
- Mantine components to use:
  - Accordion for item containers (header uses elementLabelProp)
  - Group for header actions
  - Button/ActionIcon for add/move/delete
  - Stack for layout/sections
  - Text for empty state + errors
- JsonForms expectations to keep:
  - detail UI schema resolution via findUISchema (detail option, fallback)
  - add/remove/move with array control props
  - use JsonFormsDispatch for child rendering
  - label/description/errors/visibility/enabled handling
- Vanilla behaviors to skip/simplify:
  - className/style lookup from vanilla themes
  - window.confirm delete (replace with direct remove or Mantine confirm hook later)
  - conversion to valid CSS class names
- Component split proposal:
  - ArrayControlHeader (label + add button)
  - ArrayItemPanel (Accordion panel content)
  - ArrayItemActions (header actions: move up/down/remove)
  - ArrayEmptyState (no data)
  - ArrayErrors (validation summary)
- Shared helpers:
  - buildChildPath(path, index)
  - resolveDetailUiSchema(uischemas, schema, uischema, path, rootSchema)
*/
import { isObjectArrayWithNesting, type RankedTester, rankWith } from '@jsonforms/core'
import { ArrayControl as VanillaArrayControl } from '@jsonforms/vanilla-renderers'

export const ArrayControl = VanillaArrayControl

export const arrayControlTester: RankedTester = rankWith(4, isObjectArrayWithNesting)

export default ArrayControl
