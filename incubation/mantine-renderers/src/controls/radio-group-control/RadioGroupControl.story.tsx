import type { JsonSchema7, OwnPropsOfControl } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { makeControlStory } from '../story-helpers'
import RadioGroupControl from './RadioGroupControl'

const meta = {
  component: RadioGroupControl,
} satisfies Meta<typeof RadioGroupControl>

export default meta

type Story = StoryObj<OwnPropsOfControl>

const schema: JsonSchema7 = { type: 'string', enum: ['Alpha', 'Beta', 'Gamma'], description: 'Select one option' }
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

export const Hidden: Story = makeControlStory(RadioGroupControl, {
  value: 'Gamma',
  schema,
  uischemaOptions,
  visible: false,
})

export const Reqired: Story = makeControlStory(RadioGroupControl, {
  value: undefined,
  schema,
  uischemaOptions,
  required: true,
})
