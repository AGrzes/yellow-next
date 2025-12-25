import type { ControlElement, JsonSchema7, OwnPropsOfCell } from '@jsonforms/core'
import { JsonForms } from '@jsonforms/react'
import type { StoryObj } from '@storybook/react-vite'

export type CellStoryOptions<TValue, TValueSchema extends JsonSchema7 = JsonSchema7> = {
  value: TValue
  schema: TValueSchema
  uischemaOptions?: ControlElement['options']
  enabled?: boolean
  visible?: boolean
}

type AnyComponent<P = any> = ((props: P) => any) | (new (props: P) => any)

export function makeCellStory<TValue, TValueSchema extends JsonSchema7 = JsonSchema7>(
  Cell: AnyComponent<OwnPropsOfCell>,
  { value, schema: valueSchema, uischemaOptions, enabled, visible }: CellStoryOptions<TValue, TValueSchema>
): StoryObj<OwnPropsOfCell> {
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
    render: ({ data, uischema, schema, visible, enabled, path }: OwnPropsOfCell) => {
      return (
        <JsonForms
          data={data}
          schema={schema}
          uischema={uischema}
          renderers={[
            {
              tester: () => 1,
              renderer: () => (
                <Cell path={path} visible={visible} enabled={enabled} schema={valueSchema} uischema={uischema} />
              ),
            },
          ]}
        />
      )
    },
  }
}
