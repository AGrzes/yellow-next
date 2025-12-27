import type { ControlElement, JsonSchema7 } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { makeArrayStory, type ArrayStoryArgs } from '../story-helpers'
import ArrayControl, { arrayControlTester } from './ArrayControl'

const data = {
  items: [
    { name: 'Alpha', status: 'Open', priority: 'High', owner: 'Riley', notes: 'Follow up', due: '2025-01-12' },
    { name: 'Beta', status: 'Closed', priority: 'Low', owner: 'Jordan', notes: '', due: '2025-02-01' },
  ],
}

const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          status: { type: 'string', enum: ['Open', 'Blocked', 'Closed'] },
          priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
          owner: { type: 'string' },
          notes: { type: 'string' },
          due: { type: 'string', format: 'date' },
        },
      },
    },
  },
}

const uiSchema: ControlElement = {
  type: 'Control',
  scope: '#/properties/items',
  label: 'Items',
  options: {
    elementLabelProp: 'name',
    detail: {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/name' },
            { type: 'Control', scope: '#/properties/owner' },
          ],
        },
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/status' },
            { type: 'Control', scope: '#/properties/priority' },
            { type: 'Control', scope: '#/properties/due', label: 'Due date' },
          ],
        },
        { type: 'Control', scope: '#/properties/notes', options: { multi: true, placeholder: 'Add context...' } },
      ],
    },
  },
}

const emptyData = {
  items: undefined,
}

const meta = {
  title: 'Complex/ArrayControl',
  component: ArrayControl,
} satisfies Meta<typeof ArrayControl>

export default meta

type Story = StoryObj<ArrayStoryArgs>

export const Default: Story = makeArrayStory(ArrayControl, arrayControlTester, {
  data,
  schema,
  uischema: uiSchema,
})

export const Empty: Story = makeArrayStory(ArrayControl, arrayControlTester, {
  data: emptyData,
  schema,
  uischema: uiSchema,
})
