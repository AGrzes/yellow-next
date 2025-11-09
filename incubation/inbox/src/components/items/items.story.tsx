import type { Meta, StoryObj } from '@storybook/react-vite'

import { ItemsList } from './items.js'

const meta = {
  component: ItemsList,
} satisfies Meta<typeof ItemsList>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    items: [
      {
        id: '1',
        kind: 'task',
        captured: new Date().toISOString(),
        title: 'Sample Item',
      },
      {
        id: '2',
        kind: 'email',
        captured: new Date().toISOString(),
        title: 'Important Email',
        summary: {
          markdown: 'This is a **summary** of the email content.',
        },
        read: false,
        labels: {
          priority: 'high',
          category: 'work',
        },
      },
    ],
  },
}
