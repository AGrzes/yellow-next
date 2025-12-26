import type { OwnPropsOfControl } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import RadioGroupControl from './RadioGroupControl'
import { makeControlStory } from '../story-helpers'

const meta = {
  component: RadioGroupControl,
} satisfies Meta<typeof RadioGroupControl>

export default meta

type Story = StoryObj<OwnPropsOfControl>

const schema = { type: 'string', enum: ['Alpha', 'Beta', 'Gamma'] }
const uischemaOptions = { format: 'radio' }

export const Default: Story = makeControlStory(RadioGroupControl, {
  value: 'Beta',
  schema,
  uischemaOptions,
})

export const Empty: Story = makeControlStory(RadioGroupControl, {
  value: undefined,
  schema,
  uischemaOptions,
})

export const Disabled: Story = makeControlStory(RadioGroupControl, {
  value: 'Alpha',
  schema,
  uischemaOptions,
  enabled: false,
})
