import type { CellProps, ControlElement, ControlProps, JsonSchema7, RankedTester } from '@jsonforms/core'
import { JsonForms, withJsonFormsControlProps } from '@jsonforms/react'
import type { StoryObj } from '@storybook/react-vite'

export type ArrayStoryArgs = {
  data: unknown
  schema: JsonSchema7
  uischema: ControlElement
}

type AnyComponent<P = any> = ((props: P) => any) | (new (props: P) => any)

type ArrayStoryOptions = {
  data: unknown
  schema: JsonSchema7
  uischema: ControlElement
}

const FakeControl = ({ path, visible }: ControlProps) => (
  <div
    hidden={!visible}
    style={{
      background: '#ededed',
      border: '1px dashed #b0b0b0',
      borderRadius: 4,
      color: '#4a4a4a',
      padding: '6px 10px',
    }}
  >
    {path}
  </div>
)

const FakeCell = ({ path }: CellProps) => (
  <div
    style={{
      background: '#f2f2f2',
      border: '1px dashed #bdbdbd',
      borderRadius: 4,
      color: '#4a4a4a',
      padding: '4px 8px',
    }}
  >
    {path}
  </div>
)

export function makeArrayStory(
  Renderer: AnyComponent,
  rendererTester: RankedTester,
  { data, schema, uischema }: ArrayStoryOptions
): StoryObj<ArrayStoryArgs> {
  return {
    args: {
      data,
      schema,
      uischema,
    },
    render: ({ data, schema, uischema }: ArrayStoryArgs) => (
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={[
          { tester: rendererTester, renderer: Renderer },
          { tester: () => 1, renderer: withJsonFormsControlProps(FakeControl) },
        ]}
        cells={[{ tester: () => 1, cell: FakeCell }]}
      />
    ),
  }
}
