import type { Meta, StoryObj } from '@storybook/react-vite'
import { ItemsFilter } from './items-filter'

const meta = {
  component: ItemsFilter,
} satisfies Meta<typeof ItemsFilter>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    value: {},
    onChange: (newValue) => {
      console.log('Filter changed:', newValue)
    },
  },
}

export const WithLabels: Story = {
  args: {
    value: {
      labels: {
        priority: ['high'],
        category: ['work'],
      },
    },
    onChange: (newValue) => {
      console.log('Filter changed:', newValue)
    },
    labels: {
      priority: { high: 'High Priority', medium: 'Medium Priority', low: 'Low Priority' },
      category: { work: 'Work', personal: 'Personal', spam: 'Spam' },
    },
  },
}
