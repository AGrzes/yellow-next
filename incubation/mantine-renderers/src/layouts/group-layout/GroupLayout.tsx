/*
Design notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/layouts/GroupLayout.tsx
- Mantine components: https://mantine.dev/core/fieldset/ and https://mantine.dev/core/stack/
- JsonForms expectations: renders a Group layout with optional label, respects visibility/enabled, and renders child elements in order.
- Functionality mapping:
  - label -> Fieldset legend (use Mantine Fieldset)
  - child layout -> Stack for vertical spacing
  - visibility/enabled -> Fieldset disabled + hidden handling
  - child rendering -> JsonForms renderChildren equivalent
*/
import { memo } from 'react'
import { type GroupLayout as JsonFormsGroupLayout, type LayoutProps, type RankedTester, rankWith, uiTypeIs } from '@jsonforms/core'
import { withJsonFormsLayoutProps } from '@jsonforms/react'
import { Fieldset, Stack } from '@mantine/core'
import { renderChildren } from '../render-children'

export const GroupLayout = (props: LayoutProps) => {
  const { data: _data, ...otherProps } = props
  return <GroupLayoutRendererComponent {...otherProps} />
}

const GroupLayoutRendererComponent = memo(function GroupLayoutRendererComponent({
  uischema,
  schema,
  path,
  visible,
  enabled,
  label,
}: LayoutProps) {
  const layout = uischema as JsonFormsGroupLayout
  const legend = label || undefined

  return (
    <Fieldset legend={legend} disabled={!enabled} hidden={!visible}>
      <Stack>
        {renderChildren(layout, schema, path, enabled)}
      </Stack>
    </Fieldset>
  )
})

export const groupLayoutTester: RankedTester = rankWith(1, uiTypeIs('Group'))

export default withJsonFormsLayoutProps(GroupLayout)
