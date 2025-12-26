import type { GroupLayout as JsonFormsGroupLayout, JsonSchema7 } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import GroupLayout, { groupLayoutTester } from './GroupLayout'
import { type LayoutStoryArgs, makeLayoutStory } from '../story-helpers'

const data = {
  address1: '742 Evergreen Terrace',
  address2: 'Unit 2',
  city: 'Springfield',
  postalCode: '49007',
}

const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    address1: { type: 'string' },
    address2: { type: 'string' },
    city: { type: 'string' },
    postalCode: { type: 'string' },
  },
}

const labeledUiSchema: JsonFormsGroupLayout = {
  type: 'Group',
  label: 'Address',
  elements: [
    { type: 'Control', scope: '#/properties/address1' },
    { type: 'Control', scope: '#/properties/address2' },
    { type: 'Control', scope: '#/properties/city' },
    { type: 'Control', scope: '#/properties/postalCode' },
  ],
}

const unlabeledUiSchema: JsonFormsGroupLayout = {
  type: 'Group',
  label: '',
  elements: [
    { type: 'Control', scope: '#/properties/address1' },
    { type: 'Control', scope: '#/properties/city' },
  ],
}

const meta = {
  title: 'Layouts/GroupLayout',
  component: GroupLayout,
} satisfies Meta<typeof GroupLayout>

export default meta

type Story = StoryObj<LayoutStoryArgs>

export const WithLabel: Story = makeLayoutStory(GroupLayout, groupLayoutTester, {
  data,
  schema,
  uischema: labeledUiSchema,
})

export const WithoutLabel: Story = makeLayoutStory(GroupLayout, groupLayoutTester, {
  data,
  schema,
  uischema: unlabeledUiSchema,
})
