/**
 * GroupLayout
 *
 * Layout renderer that groups children under an optional legend.
 *
 * Implementing: https://jsonforms.io/docs/uischema/layouts
 * Inspired By: https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers/src/layouts/GroupLayout.tsx
 * Implementation Notes:
 * - Drops `data` before passing props to the memoized renderer.
 * - Uses Mantine Fieldset for the group container and `renderChildren` for content.
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

const _default: ReturnType<typeof withJsonFormsLayoutProps> = withJsonFormsLayoutProps(GroupLayout)
export default _default
