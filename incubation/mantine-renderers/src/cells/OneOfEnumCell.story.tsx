import type { JsonSchema7, OwnPropsOfCell } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { OneOfEnumCell } from './OneOfEnumCell'
import { makeCellStory } from './story-helpers'

const meta = {
  component: OneOfEnumCell,
} satisfies Meta<typeof OneOfEnumCell>

export default meta
type Story = StoryObj<OwnPropsOfCell>

const schema: JsonSchema7 = {
  type: 'string',
  oneOf: [
    { const: 'alpha', title: 'Alpha' },
    { const: 'beta', title: 'Beta' },
    { const: 'gamma', title: 'Gamma' },
  ],
}

export const Default: Story = makeCellStory(OneOfEnumCell, {
  value: 'beta',
  schema,
})

export const Empty: Story = makeCellStory(OneOfEnumCell, {
  value: undefined,
  schema,
})

export const Disabled: Story = makeCellStory(OneOfEnumCell, {
  value: 'gamma',
  schema,
  enabled: false,
})
