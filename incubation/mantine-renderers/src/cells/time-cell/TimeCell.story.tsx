import type { OwnPropsOfCell } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import TimeCell from './TimeCell'
import { makeCellStory } from '../story-helpers'

const meta = {
  component: TimeCell,
} satisfies Meta<typeof TimeCell>

export default meta
type Story = StoryObj<OwnPropsOfCell>

const schema = { type: 'string', format: 'time' }

export const Default: Story = makeCellStory(TimeCell, {
  value: '13:45:00',
  schema,
})

export const Empty: Story = makeCellStory(TimeCell, {
  value: undefined,
  schema,
})

export const Disabled: Story = makeCellStory(TimeCell, {
  value: '13:45:00',
  schema,
  enabled: false,
})
