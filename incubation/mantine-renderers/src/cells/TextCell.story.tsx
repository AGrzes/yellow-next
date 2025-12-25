import { JsonForms } from '@jsonforms/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextCell } from './TextCell'

const meta = {
  component: TextCell,
} satisfies Meta<typeof TextCell>

export default meta
type Story = StoryObj<typeof meta>

function makeCellStory({ value, type, enabled, visible }: any) {
  return {
    args: {
      data: { value: value },
      path: 'value',
      uischema: { type: 'Control', scope: '#/properties/value' },
      schema: { type: 'object', properties: { value: { type: type } } },
      enabled,
      visible,
      id: 'cell',
    },
    render: ({ data, uischema, schema, visible, enabled, path }) => (
      <JsonForms
        data={data}
        renderers={[
          {
            tester: () => 1,
            renderer: () => (
              <TextCell path={path} visible={visible} enabled={enabled} schema={schema} uischema={uischema} />
            ),
          },
        ]}
      />
    ),
  } as Story
}

export const Default: Story = makeCellStory({
  value: 'Sample text',
  type: 'string',
  enabled: true,
  visible: true,
})
