import type { OwnPropsOfCell } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import NumberCell from './NumberCell'
import { makeCellStory } from '../story-helpers'

const meta = {
  component: NumberCell,
} satisfies Meta<typeof NumberCell>

export default meta
type Story = StoryObj<OwnPropsOfCell>

const schema = { type: 'number' }

export const Default: Story = makeCellStory(NumberCell, {
  value: 3.14,
  schema,
})

export const Empty: Story = makeCellStory(NumberCell, {
  value: undefined,
  schema,
})

export const Disabled: Story = makeCellStory(NumberCell, {
  value: 3.14,
  schema,
  enabled: false,
})
