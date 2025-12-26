import type { OwnPropsOfControl } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import InputControl from './InputControl'
import { makeControlStory } from '../story-helpers'

const meta = {
  component: InputControl,
} satisfies Meta<typeof InputControl>

export default meta

type Story = StoryObj<OwnPropsOfControl>

const schema = { type: 'string', description: 'Simple text input' }

export const Default: Story = makeControlStory(InputControl, {
  value: 'Sample text',
  schema,
})

export const Empty: Story = makeControlStory(InputControl, {
  value: undefined,
  schema,
  uischemaOptions: { placeholder: 'Enter text...' },
})

export const Disabled: Story = makeControlStory(InputControl, {
  value: 'Disabled text',
  schema,
  enabled: false,
})
