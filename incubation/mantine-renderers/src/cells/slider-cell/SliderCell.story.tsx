import type { OwnPropsOfCell } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import SliderCell from './SliderCell'
import { makeCellStory } from '../story-helpers'

const meta = {
  component: SliderCell,
} satisfies Meta<typeof SliderCell>

export default meta
type Story = StoryObj<OwnPropsOfCell>

const schema = { type: 'number', minimum: 0, maximum: 100, default: 25 }
const uischemaOptions = { slider: true }

export const Default: Story = makeCellStory(SliderCell, {
  value: 40,
  schema,
  uischemaOptions,
})

export const Empty: Story = makeCellStory(SliderCell, {
  value: undefined,
  schema,
  uischemaOptions,
})

export const Disabled: Story = makeCellStory(SliderCell, {
  value: 40,
  schema,
  uischemaOptions,
  enabled: false,
})
