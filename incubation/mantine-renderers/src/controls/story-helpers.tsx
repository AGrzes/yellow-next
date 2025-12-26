import type { ControlElement, JsonSchema7, OwnPropsOfControl } from '@jsonforms/core'
import { JsonForms } from '@jsonforms/react'
import type { StoryObj } from '@storybook/react-vite'
import { mantineCells } from '../index'

export type ControlStoryOptions<TValue, TValueSchema extends JsonSchema7 = JsonSchema7> = {
  value: TValue
  schema: TValueSchema
  uischemaOptions?: ControlElement['options']
  enabled?: boolean
  visible?: boolean
  required?: boolean
}

type AnyComponent<P = any> = ((props: P) => any) | (new (props: P) => any)

export function makeControlStory<TValue, TValueSchema extends JsonSchema7 = JsonSchema7>(
  Control: AnyComponent<OwnPropsOfControl>,
  { value, schema: valueSchema, uischemaOptions, enabled, visible, required }: ControlStoryOptions<TValue, TValueSchema>
): StoryObj<OwnPropsOfControl> {
  return {
    args: {
      enabled,
      visible,
      path: 'value',
      uischema: { type: 'Control', scope: '#/properties/value', options: uischemaOptions },
      schema: {
        type: 'object',
        properties: { value: valueSchema },
      },
    },
    render: ({ enabled, visible }: OwnPropsOfControl) => {
      return (
        <JsonForms
          data={{ value }}
          schema={{
            type: 'object',
            properties: { value: valueSchema },
            required: required ? ['value'] : [],
          }}
          uischema={{ type: 'Control', scope: '#/properties/value', options: uischemaOptions }}
          renderers={[
            {
              tester: () => 1,
              renderer: (props: OwnPropsOfControl) => <Control {...props} enabled={enabled} visible={visible} />,
            },
          ]}
          cells={mantineCells}
        />
      )
    },
  }
}
