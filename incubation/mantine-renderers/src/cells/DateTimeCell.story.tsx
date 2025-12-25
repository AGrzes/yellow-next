import type { OwnPropsOfCell } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateTimeCell } from './DateTimeCell'
import { makeCellStory } from './story-helpers'

const meta = {
  component: DateTimeCell,
} satisfies Meta<typeof DateTimeCell>

export default meta
type Story = StoryObj<OwnPropsOfCell>

const schema = { type: 'string', format: 'date-time' }

export const Default: Story = makeCellStory(DateTimeCell, {
  value: '2025-01-15T13:45:00Z',
  schema,
})

export const Empty: Story = makeCellStory(DateTimeCell, {
  value: undefined,
  schema,
})

export const Disabled: Story = makeCellStory(DateTimeCell, {
  value: '2025-01-15T13:45:00Z',
  schema,
  enabled: false,
})
