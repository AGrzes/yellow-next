import type { Meta, StoryObj } from '@storybook/react-vite'

import { ItemDetails } from './item-details.js'

const meta = {
  component: ItemDetails,
} satisfies Meta<typeof ItemDetails>

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
      details: {
        html: '<p>Here are the full details of the email, including <strong>formatted</strong> content.</p>',
      },

      read: false,
      labels: {
        priority: 'high',
        category: 'work',
      },
    },
  },
}
