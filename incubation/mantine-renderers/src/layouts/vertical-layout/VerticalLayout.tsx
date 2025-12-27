/**
 * VerticalLayout
 *
 * Layout renderer that stacks children vertically.
 *
 * Implementing: https://jsonforms.io/docs/uischema/layouts
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/layouts/VerticalLayout.tsx
 * Implementation Notes:
 * - Drops `data` before passing props to the memoized renderer.
 * - Renders children through the shared `renderChildren` helper.
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

const _default: ReturnType<typeof withJsonFormsLayoutProps> = withJsonFormsLayoutProps(VerticalLayout, false)
export default _default
