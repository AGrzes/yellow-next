/*
Design notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/layouts/HorizontalLayout.tsx
- Mantine component: https://mantine.dev/core/group/
- JsonForms expectations: renders a HorizontalLayout with children ordered left-to-right, respects visibility/enabled.
- Functionality mapping:
  - children -> Group with spacing
  - visibility/enabled -> wrapper hidden/disabled handling
  - child rendering -> JsonForms renderChildren equivalent
*/
import { memo } from 'react'
import { type HorizontalLayout as JsonFormsHorizontalLayout, type LayoutProps, type RankedTester, rankWith, uiTypeIs } from '@jsonforms/core'
import { withJsonFormsLayoutProps } from '@jsonforms/react'
import { Group } from '@mantine/core'
import { renderChildren } from '../render-children'

export const HorizontalLayout = (props: LayoutProps) => {
  const { data: _data, ...otherProps } = props
  return <HorizontalLayoutRendererComponent {...otherProps} />
}

const HorizontalLayoutRendererComponent = memo(function HorizontalLayoutRendererComponent({
  uischema,
  schema,
  path,
  visible,
  enabled,
}: LayoutProps) {
  const layout = uischema as JsonFormsHorizontalLayout

  return (
    <Group hidden={!visible}>
      {renderChildren(layout, schema, path, enabled)}
    </Group>
  )
})

export const horizontalLayoutTester: RankedTester = rankWith(1, uiTypeIs('HorizontalLayout'))

export default withJsonFormsLayoutProps(HorizontalLayout, false)
