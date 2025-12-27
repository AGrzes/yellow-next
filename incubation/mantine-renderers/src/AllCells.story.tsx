import type { ControlElement, JsonSchema7 } from '@jsonforms/core'
import { JsonForms } from '@jsonforms/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { mantineCells, mantineRenderers } from './index'

const makeStory = (schema: JsonSchema7, uischema: ControlElement, data: Record<string, unknown>) => ({
  args: {
    data,
    schema,
    uischema,
    renderers: mantineRenderers,
    cells: mantineCells,
  },
})

const meta = {
  title: 'Forms/Cells',
  component: JsonForms,
} satisfies Meta<typeof JsonForms>

export default meta

type Story = StoryObj<typeof meta>

export const Text: Story = makeStory(
  { type: 'object', properties: { value: { type: 'string' } } },
  { type: 'Control', scope: '#/properties/value', label: 'Text' },
  { value: 'Sample text' }
)

export const Password: Story = makeStory(
  { type: 'object', properties: { value: { type: 'string' } } },
  { type: 'Control', scope: '#/properties/value', label: 'Password', options: { format: 'password' } },
  { value: 's3cr3t' }
)

export const TextWithPlaceholder: Story = makeStory(
  { type: 'object', properties: { value: { type: 'string' } } },
  { type: 'Control', scope: '#/properties/value', label: 'Text (placeholder)', options: { placeholder: 'Enter text...' } },
  { value: '' }
)

export const TextArea: Story = makeStory(
  { type: 'object', properties: { value: { type: 'string' } } },
  {
    type: 'Control',
    scope: '#/properties/value',
    label: 'Text Area',
    options: { multi: true, placeholder: 'Write a few lines...' },
  },
  { value: 'Line one\nLine two' }
)

export const Enum: Story = makeStory(
  { type: 'object', properties: { value: { type: 'string', enum: ['Alpha', 'Beta', 'Gamma'] } } },
  { type: 'Control', scope: '#/properties/value', label: 'Enum' },
  { value: 'Beta' }
)

export const OneOfEnum: Story = makeStory(
  {
    type: 'object',
    properties: {
      value: {
        type: 'string',
        oneOf: [
          { const: 'alpha', title: 'Alpha' },
          { const: 'beta', title: 'Beta' },
          { const: 'gamma', title: 'Gamma' },
        ],
      },
    },
  },
  { type: 'Control', scope: '#/properties/value', label: 'One Of Enum' },
  { value: 'beta' }
)

export const Boolean: Story = makeStory(
  { type: 'object', properties: { value: { type: 'boolean' } } },
  { type: 'Control', scope: '#/properties/value', label: 'Boolean' },
  { value: true }
)

export const Integer: Story = makeStory(
  { type: 'object', properties: { value: { type: 'integer' } } },
  { type: 'Control', scope: '#/properties/value', label: 'Integer' },
  { value: 42 }
)

export const Number: Story = makeStory(
  { type: 'object', properties: { value: { type: 'number' } } },
  { type: 'Control', scope: '#/properties/value', label: 'Number' },
  { value: 3.14 }
)

export const Slider: Story = makeStory(
  { type: 'object', properties: { value: { type: 'number', minimum: 0, maximum: 100, default: 25 } } },
  { type: 'Control', scope: '#/properties/value', label: 'Slider', options: { slider: true } },
  { value: 40 }
)

export const Date: Story = makeStory(
  { type: 'object', properties: { value: { type: 'string', format: 'date' } } },
  { type: 'Control', scope: '#/properties/value', label: 'Date' },
  { value: '2025-01-15' }
)

export const Time: Story = makeStory(
  { type: 'object', properties: { value: { type: 'string', format: 'time' } } },
  { type: 'Control', scope: '#/properties/value', label: 'Time' },
  { value: '13:45:00' }
)

export const DateTime: Story = makeStory(
  { type: 'object', properties: { value: { type: 'string', format: 'date-time' } } },
  { type: 'Control', scope: '#/properties/value', label: 'Date Time' },
  { value: '2025-01-15T13:45:00Z' }
)
