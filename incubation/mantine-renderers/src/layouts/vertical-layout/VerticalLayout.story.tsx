import type { JsonSchema7, Layout } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type LayoutStoryArgs, makeLayoutStory } from '../story-helpers'
import VerticalLayout, { verticalLayoutTester } from './VerticalLayout'

const data = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  role: 'Analyst',
  team: 'Research',
}

const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    role: { type: 'string' },
    team: { type: 'string' },
  },
}

const defaultUiSchema: Layout = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/firstName' },
    { type: 'Control', scope: '#/properties/lastName' },
    { type: 'Control', scope: '#/properties/email' },
  ],
}

const manyUiSchema: Layout = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/firstName' },
    { type: 'Control', scope: '#/properties/lastName' },
    { type: 'Control', scope: '#/properties/email' },
    { type: 'Control', scope: '#/properties/role' },
    { type: 'Control', scope: '#/properties/team' },
  ],
}

const meta = {
  title: 'Layouts/VerticalLayout',
  component: VerticalLayout,
} satisfies Meta<typeof VerticalLayout>

export default meta

type Story = StoryObj<LayoutStoryArgs>

export const Default: Story = makeLayoutStory(VerticalLayout, verticalLayoutTester, {
  data,
  schema,
  uischema: defaultUiSchema,
})

export const ManyItems: Story = makeLayoutStory(VerticalLayout, verticalLayoutTester, {
  data,
  schema,
  uischema: manyUiSchema,
})
