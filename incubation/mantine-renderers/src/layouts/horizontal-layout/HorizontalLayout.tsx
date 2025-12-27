/**
 * HorizontalLayout
 *
 * Layout renderer that places children left-to-right.
 *
 * Implementing: https://jsonforms.io/docs/uischema/layouts
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/layouts/HorizontalLayout.tsx
 * Implementation Notes:
 * - Drops `data` before passing props to the memoized renderer.
 * - Renders children through the shared `renderChildren` helper.
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
