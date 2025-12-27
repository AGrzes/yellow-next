import type { ControlElement, JsonSchema7 } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import TableArrayControl, { tableArrayControlTester } from './TableArrayControl'
import { makeArrayStory, type ArrayStoryArgs } from '../story-helpers'

const primitiveData = {
  tags: ['Urgent', 'Internal', 'Review'],
}

const primitiveSchema: JsonSchema7 = {
  type: 'object',
  properties: {
    tags: {
      type: 'array',
      items: { type: 'string' },
    },
  },
}

const primitiveUiSchema: ControlElement = {
  type: 'Control',
  scope: '#/properties/tags',
  label: 'Tags',
}

const objectData = {
  rows: [
    { title: 'Phase 1', owner: 'Alex', status: 'Open', hours: 6 },
    { title: 'Phase 2', owner: 'Jamie', status: 'Blocked', hours: 12 },
  ],
}

const objectSchema: JsonSchema7 = {
  type: 'object',
  properties: {
    rows: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          owner: { type: 'string' },
          status: { type: 'string', enum: ['Open', 'Blocked', 'Closed'] },
          hours: { type: 'number' },
        },
      },
    },
  },
}

const objectUiSchema: ControlElement = {
  type: 'Control',
  scope: '#/properties/rows',
  label: 'Rows',
}

const meta = {
  title: 'Complex/TableArrayControl',
  component: TableArrayControl,
} satisfies Meta<typeof TableArrayControl>

export default meta

type Story = StoryObj<ArrayStoryArgs>

export const PrimitiveItems: Story = makeArrayStory(TableArrayControl, tableArrayControlTester, {
  data: primitiveData,
  schema: primitiveSchema,
  uischema: primitiveUiSchema,
})

export const ObjectItems: Story = makeArrayStory(TableArrayControl, tableArrayControlTester, {
  data: objectData,
  schema: objectSchema,
  uischema: objectUiSchema,
})
