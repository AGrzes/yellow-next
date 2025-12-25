import type { OwnPropsOfCell } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import TextCell from './TextCell'
import { makeCellStory } from './story-helpers'

const meta = {
  component: TextCell,
} satisfies Meta<typeof TextCell>

export default meta
type Story = StoryObj<OwnPropsOfCell>

export const Default: Story = makeCellStory(TextCell, {
  value: 'Sample text',
  schema: { type: 'string' },
})

export const EmptyWithPlaceholder: Story = makeCellStory(TextCell, {
  value: undefined,
  schema: { type: 'string' },
  uischemaOptions: { placeholder: 'Enter text here...' },
})

export const Disabled: Story = makeCellStory(TextCell, {
  value: 'Disabled text',
  schema: { type: 'string' },
  enabled: false,
})
