import type { JsonSchema7, Layout } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import HorizontalLayout, { horizontalLayoutTester } from './HorizontalLayout'
import { type LayoutStoryArgs, makeLayoutStory } from '../story-helpers'

const data = {
  street: '221B Baker Street',
  city: 'London',
  postalCode: 'NW1 6XE',
  region: 'Greater London',
  country: 'UK',
}

const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    street: { type: 'string' },
    city: { type: 'string' },
    postalCode: { type: 'string' },
    region: { type: 'string' },
    country: { type: 'string' },
  },
}

const defaultUiSchema: Layout = {
  type: 'HorizontalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/street' },
    { type: 'Control', scope: '#/properties/city' },
    { type: 'Control', scope: '#/properties/postalCode' },
  ],
}

const twoColumnUiSchema: Layout = {
  type: 'HorizontalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/region' },
    { type: 'Control', scope: '#/properties/country' },
  ],
}

const meta = {
  title: 'Layouts/HorizontalLayout',
  component: HorizontalLayout,
} satisfies Meta<typeof HorizontalLayout>

export default meta

type Story = StoryObj<LayoutStoryArgs>

export const Default: Story = makeLayoutStory(HorizontalLayout, horizontalLayoutTester, {
  data,
  schema,
  uischema: defaultUiSchema,
})

export const TwoColumns: Story = makeLayoutStory(HorizontalLayout, horizontalLayoutTester, {
  data,
  schema,
  uischema: twoColumnUiSchema,
})
