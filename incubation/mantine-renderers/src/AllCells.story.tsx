import { JsonForms } from '@jsonforms/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { mantineCells, mantineRenderers } from './index'

const data = {
  text: 'Sample text',
  textPassword: 's3cr3t',
  textArea: 'Line one\nLine two',
  enum: 'Beta',
  oneOfEnum: 'beta',
  boolean: true,
  integer: 42,
  number: 3.14,
  numberFormat: 12000,
  slider: 40,
  date: '2025-01-15',
  time: '13:45:00',
  dateTime: '2025-01-15T13:45:00Z',
}

const schema = {
  type: 'object',
  properties: {
    text: { type: 'string' },
    textPassword: { type: 'string' },
    textWithPlaceholder: { type: 'string' },
    textArea: { type: 'string' },
    enum: { type: 'string', enum: ['Alpha', 'Beta', 'Gamma'] },
    oneOfEnum: {
      type: 'string',
      oneOf: [
        { const: 'alpha', title: 'Alpha' },
        { const: 'beta', title: 'Beta' },
        { const: 'gamma', title: 'Gamma' },
      ],
    },
    boolean: { type: 'boolean' },
    integer: { type: 'integer' },
    number: { type: 'number' },
    numberFormat: { type: 'integer' },
    slider: { type: 'number', minimum: 0, maximum: 100, default: 25 },
    date: { type: 'string', format: 'date' },
    time: { type: 'string', format: 'time' },
    dateTime: { type: 'string', format: 'date-time' },
  },
}

const uischema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/text', label: 'Text' },
    {
      type: 'Control',
      scope: '#/properties/textPassword',
      label: 'Password',
      options: { format: 'password' },
    },
    {
      type: 'Control',
      scope: '#/properties/textWithPlaceholder',
      label: 'Text (placeholder)',
      options: { placeholder: 'Enter text here...' },
    },
    {
      type: 'Control',
      scope: '#/properties/textArea',
      label: 'Text Area',
      options: { multi: true, placeholder: 'Write a few lines...' },
    },
    { type: 'Control', scope: '#/properties/enum', label: 'Enum' },
    { type: 'Control', scope: '#/properties/oneOfEnum', label: 'One Of Enum' },
    { type: 'Control', scope: '#/properties/boolean', label: 'Boolean' },
    { type: 'Control', scope: '#/properties/integer', label: 'Integer' },
    { type: 'Control', scope: '#/properties/number', label: 'Number' },
    /*{
      type: 'Control',
      scope: '#/properties/numberFormat',
      label: 'Number (formatted)',
      options: { format: true },
    },*/
    {
      type: 'Control',
      scope: '#/properties/slider',
      label: 'Slider',
      options: { slider: true },
    },
    { type: 'Control', scope: '#/properties/date', label: 'Date' },
    { type: 'Control', scope: '#/properties/time', label: 'Time' },
    { type: 'Control', scope: '#/properties/dateTime', label: 'Date Time' },
  ],
}

const meta = {
  title: 'Forms/All Cells',
  component: JsonForms,
} satisfies Meta<typeof JsonForms>

export default meta

type Story = StoryObj<typeof meta>

export const AllCells: Story = {
  args: {
    data,
    schema,
    uischema,
    renderers: mantineRenderers,
    cells: mantineCells,
  },
}
