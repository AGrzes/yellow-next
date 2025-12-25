import type { OwnPropsOfCell } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { NumberFormatCell } from './NumberFormatCell'
import { makeCellStory } from '../story-helpers'

type FormatProps = OwnPropsOfCell & {
  toFormatted: (value: number | undefined) => string
  fromFormatted: (formatted: string) => number | undefined
}

const NumberFormatCellWithFormat = (props: OwnPropsOfCell) => {
  const Cell = NumberFormatCell as unknown as (cellProps: FormatProps) => any

  return (
    <Cell
      {...props}
      toFormatted={(value) => (value == null ? '' : String(value))}
      fromFormatted={(formatted) => (formatted === '' ? undefined : Number(formatted))}
    />
  )
}

const meta = {
  component: NumberFormatCellWithFormat,
} satisfies Meta<typeof NumberFormatCellWithFormat>

export default meta
type Story = StoryObj<OwnPropsOfCell>

const schema = { type: 'integer' }
const uischemaOptions = { format: true }

export const Default: Story = makeCellStory(NumberFormatCellWithFormat, {
  value: 12000,
  schema,
  uischemaOptions,
})

export const Empty: Story = makeCellStory(NumberFormatCellWithFormat, {
  value: undefined,
  schema,
  uischemaOptions,
})

export const Disabled: Story = makeCellStory(NumberFormatCellWithFormat, {
  value: 12000,
  schema,
  uischemaOptions,
  enabled: false,
})
