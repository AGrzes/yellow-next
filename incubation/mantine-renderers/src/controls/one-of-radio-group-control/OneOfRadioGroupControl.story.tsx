import type { OwnPropsOfControl } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import OneOfRadioGroupControl from './OneOfRadioGroupControl'
import { makeControlStory } from '../story-helpers'

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
