import type { Meta, StoryObj } from '@storybook/react-vite'

import { ItemLine } from './item.js'

const meta = {
  component: ItemLine,
} satisfies Meta<typeof ItemLine>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    item: {
      id: '1',
      kind: 'task',
      captured: new Date().toISOString(),
      title: 'Sample Item',
    },
  },
}

export const Full: Story = {
  args: {
    item: {
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
  },
}
