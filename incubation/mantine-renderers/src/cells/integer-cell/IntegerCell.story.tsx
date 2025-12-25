import type { OwnPropsOfCell } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { IntegerCell } from './IntegerCell'
import { makeCellStory } from '../story-helpers'

const meta = {
  component: IntegerCell,
} satisfies Meta<typeof IntegerCell>

export default meta
type Story = StoryObj<OwnPropsOfCell>

const schema = { type: 'integer' }

export const Default: Story = makeCellStory(IntegerCell, {
  value: 42,
  schema,
})

export const Empty: Story = makeCellStory(IntegerCell, {
  value: undefined,
  schema,
})

export const Disabled: Story = makeCellStory(IntegerCell, {
  value: 42,
  schema,
  enabled: false,
})
