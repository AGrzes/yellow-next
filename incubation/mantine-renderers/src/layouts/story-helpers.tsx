import {
  isControl,
  rankWith,
  type ControlProps,
  type JsonSchema7,
  type Layout,
  type RankedTester,
} from '@jsonforms/core'
import { JsonForms, withJsonFormsControlProps } from '@jsonforms/react'
import type { StoryObj } from '@storybook/react-vite'

type AnyComponent<P = any> = ((props: P) => any) | (new (props: P) => any)

export type LayoutStoryOptions<TSchema extends JsonSchema7 = JsonSchema7> = {
  data: unknown
  schema: TSchema
  uischema: Layout
}

export type LayoutStoryArgs = {
  data: unknown
  schema: JsonSchema7
  uischema: Layout
}

const FakeControl = ({ path, uischema }: ControlProps) => {
  console.log(path, uischema.scope)
  return (
    <div
      style={{
        background: '#ededed',
        border: '1px dashed #b0b0b0',
        borderRadius: 4,
        color: '#4a4a4a',
        padding: '8px 12px',
        width: 300,
      }}
    >
      {path}
    </div>
  )
}

const fakeControlTester: RankedTester = rankWith(1, isControl)

export function makeLayoutStory<TSchema extends JsonSchema7 = JsonSchema7>(
  LayoutRenderer: AnyComponent,
  layoutTester: RankedTester,
  { data, schema, uischema }: LayoutStoryOptions<TSchema>
): StoryObj<LayoutStoryArgs> {
  return {
    args: {
      data,
      schema,
      uischema,
    },
    render: ({ data, schema, uischema }: LayoutStoryArgs) => (
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={[
          { tester: layoutTester, renderer: LayoutRenderer },
          { tester: fakeControlTester, renderer: withJsonFormsControlProps(FakeControl) },
        ]}
      />
    ),
  }
}
