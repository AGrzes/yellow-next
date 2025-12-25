import type { OwnPropsOfCell } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { EnumCell } from './EnumCell'
import { makeCellStory } from './story-helpers'

const meta = {
  component: EnumCell,
} satisfies Meta<typeof EnumCell>

export default meta
type Story = StoryObj<OwnPropsOfCell>

const schema = { type: 'string', enum: ['Alpha', 'Beta', 'Gamma'] }

export const Default: Story = makeCellStory(EnumCell, {
  value: 'Beta',
  schema,
})

export const Empty: Story = makeCellStory(EnumCell, {
  value: undefined,
  schema,
})

export const Disabled: Story = makeCellStory(EnumCell, {
  value: 'Gamma',
  schema,
  enabled: false,
})
