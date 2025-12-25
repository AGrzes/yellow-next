import type { ControlElement, JsonSchema7 } from '@jsonforms/core'
import { JsonForms } from '@jsonforms/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextCell } from './TextCell'

const meta = {
  component: TextCell,
} satisfies Meta<typeof TextCell>

export default meta
type Story = StoryObj<typeof meta>

type CellStoryOptions<TValue, TValueSchema extends JsonSchema7 = JsonSchema7> = {
  value: TValue
  schema: TValueSchema
  uischemaOptions?: ControlElement['options']
  enabled?: boolean
  visible?: boolean
}

function makeCellStory<TValue, TValueSchema extends JsonSchema7 = JsonSchema7>({
  value,
  schema: valueSchema,
  uischemaOptions,
  enabled,
  visible,
}: CellStoryOptions<TValue, TValueSchema>) {
  return {
    args: {
      data: { value },
      path: 'value',
      uischema: { type: 'Control', scope: '#/properties/value', options: uischemaOptions },
      schema: {
        type: 'object',
        properties: { value: valueSchema },
      },
      enabled: enabled,
      visible: visible,
      id: 'cell',
    },
    render: ({ data, uischema, schema, visible, enabled, path }) => {
      return (
        <JsonForms
          data={data}
          schema={schema}
          uischema={uischema}
          renderers={[
            {
              tester: () => 1,
              renderer: () => (
                <TextCell path={path} visible={visible} enabled={enabled} schema={schema} uischema={uischema} />
              ),
            },
          ]}
        />
      )
    },
  } as Story
}

export const Default: Story = makeCellStory({
  value: 'Sample text',
  schema: { type: 'string' },
})

export const EmptyWithPlaceholder: Story = makeCellStory({
  value: undefined,
  schema: { type: 'string' },
})

export const Disabled: Story = makeCellStory({
  value: 'Disabled text',
  schema: { type: 'string' },
  enabled: false,
})
