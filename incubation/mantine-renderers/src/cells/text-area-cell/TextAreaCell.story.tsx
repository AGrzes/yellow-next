import type { OwnPropsOfCell } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import TextAreaCell from './TextAreaCell'
import { makeCellStory } from '../story-helpers'

const meta = {
  component: TextAreaCell,
} satisfies Meta<typeof TextAreaCell>

export default meta
type Story = StoryObj<OwnPropsOfCell>

const schema = { type: 'string' }
const uischemaOptions = { multi: true, placeholder: 'Write a few lines...' }

export const Default: Story = makeCellStory(TextAreaCell, {
  value: 'Line one\nLine two',
  schema,
  uischemaOptions,
})

export const Empty: Story = makeCellStory(TextAreaCell, {
  value: undefined,
  schema,
  uischemaOptions,
})

export const Disabled: Story = makeCellStory(TextAreaCell, {
  value: 'Read-only text',
  schema,
  uischemaOptions,
  enabled: false,
})
