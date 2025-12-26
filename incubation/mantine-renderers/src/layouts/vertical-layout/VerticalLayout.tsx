/*
Design notes (Mantine)
- Vanilla reference: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/layouts/VerticalLayout.tsx
- Mantine component: https://mantine.dev/core/stack/
- JsonForms expectations: renders a VerticalLayout with children top-to-bottom, respects visibility/enabled.
- Functionality mapping:
  - children -> Stack with spacing
  - visibility/enabled -> wrapper hidden/disabled handling
  - child rendering -> JsonForms renderChildren equivalent
*/
import { memo } from 'react'
import { type LayoutProps, type RankedTester, rankWith, uiTypeIs, type VerticalLayout as JsonFormsVerticalLayout } from '@jsonforms/core'
import { withJsonFormsLayoutProps } from '@jsonforms/react'
import { Stack } from '@mantine/core'
import { renderChildren } from '../render-children'

export const VerticalLayout = (props: LayoutProps) => {
  const { data: _data, ...otherProps } = props
  return <VerticalLayoutRendererComponent {...otherProps} />
}

const VerticalLayoutRendererComponent = memo(function VerticalLayoutRendererComponent({
  uischema,
  schema,
  path,
  visible,
  enabled,
}: LayoutProps) {
  const layout = uischema as JsonFormsVerticalLayout

  return (
    <Stack hidden={!visible}>
      {renderChildren(layout, schema, path, enabled)}
    </Stack>
  )
})

export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'))

export default withJsonFormsLayoutProps(VerticalLayout, false)
