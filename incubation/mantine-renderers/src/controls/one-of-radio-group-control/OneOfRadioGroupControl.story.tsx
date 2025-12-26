import type { OwnPropsOfControl } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { makeControlStory } from '../story-helpers'
import OneOfRadioGroupControl from './OneOfRadioGroupControl'

const meta = {
  component: OneOfRadioGroupControl,
} satisfies Meta<typeof OneOfRadioGroupControl>

export default meta

type Story = StoryObj<OwnPropsOfControl>

const schema = {
  type: 'string',
  oneOf: [
    { const: 'alpha', title: 'Alpha' },
    { const: 'beta', title: 'Beta' },
    { const: 'gamma', title: 'Gamma' },
  ],
  description: 'Select one option',
}
const uischemaOptions = { format: 'radio' }

export const Default: Story = makeControlStory(OneOfRadioGroupControl, {
  value: 'beta',
  schema,
  uischemaOptions,
})

export const Empty: Story = makeControlStory(OneOfRadioGroupControl, {
  value: undefined,
  schema,
  uischemaOptions,
})

export const Disabled: Story = makeControlStory(OneOfRadioGroupControl, {
  value: 'alpha',
  schema,
  uischemaOptions,
  enabled: false,
})

export const Hidden: Story = makeControlStory(OneOfRadioGroupControl, {
  value: 'Gamma',
  schema,
  uischemaOptions,
  visible: false,
})

export const Reqired: Story = makeControlStory(OneOfRadioGroupControl, {
  value: undefined,
  schema,
  uischemaOptions,
  required: true,
})
