import type { OwnPropsOfCell } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateCell } from './DateCell'
import { makeCellStory } from './story-helpers'

const meta = {
  component: DateCell,
} satisfies Meta<typeof DateCell>

export default meta
type Story = StoryObj<OwnPropsOfCell>

const schema = { type: 'string', format: 'date' }

export const Default: Story = makeCellStory(DateCell, {
  value: '2025-01-15',
  schema,
})

export const Empty: Story = makeCellStory(DateCell, {
  value: undefined,
  schema,
})

export const Disabled: Story = makeCellStory(DateCell, {
  value: '2025-01-15',
  schema,
  enabled: false,
})
