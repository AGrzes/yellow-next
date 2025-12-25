import type { OwnPropsOfCell } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BooleanCell } from './BooleanCell'
import { makeCellStory } from '../story-helpers'

const meta = {
  component: BooleanCell,
} satisfies Meta<typeof BooleanCell>

export default meta
type Story = StoryObj<OwnPropsOfCell>

const schema = { type: 'boolean' }

export const Checked: Story = makeCellStory(BooleanCell, {
  value: true,
  schema,
})

export const Unchecked: Story = makeCellStory(BooleanCell, {
  value: false,
  schema,
})

export const Disabled: Story = makeCellStory(BooleanCell, {
  value: true,
  schema,
  enabled: false,
})
