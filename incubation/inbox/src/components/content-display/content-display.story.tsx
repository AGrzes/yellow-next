import type { Content } from '@model/item.ts'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContentDisplay } from './content-display'

const meta = {
  component: ContentDisplay,
} satisfies Meta<typeof ContentDisplay>

export default meta
type Story = StoryObj<typeof meta>

const markdownContent: Content = {
  markdown: 'This is **Markdown** content.',
}

const htmlContent: Content = {
  html: '<p>This is <strong>HTML</strong> content.</p>',
}

export const Markdown: Story = {
  args: {
    content: markdownContent,
    fontSize: 'sm',
    color: 'gray.500',
  },
}

export const HTML: Story = {
  args: {
    content: htmlContent,
    fontSize: 'sm',
    color: 'gray.500',
  },
}
