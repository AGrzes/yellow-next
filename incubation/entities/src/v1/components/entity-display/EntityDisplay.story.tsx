import type { UISchemaElement } from '@jsonforms/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Entity } from '@v1/entity'
import { EntityDisplay } from './EntityDisplay'

const schema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    year: { type: 'number' },
    author: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
    },
  },
  required: ['title'],
}

const entity: Entity<{ title: string; year: number; author: { name: string } }> = {
  type: 'book',
  id: 'book-1',
  body: {
    title: 'Dune',
    year: 1965,
    author: { name: 'Frank Herbert' },
  },
  meta: {
    type: {
      schema,
    } as any,
  },
}

const inlineUiSchema: UISchemaElement = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/title', label: 'Title' },
    { type: 'Control', scope: '#/properties/year', label: 'Publication Year' },
    { type: 'Control', scope: '#/properties/author/properties/name', label: 'Author' },
  ],
}

const meta = {
  component: EntityDisplay,
} satisfies Meta<typeof EntityDisplay>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    entity,
  },
}

export const InlineUiSchema: Story = {
  args: {
    entity,
    uiSchema: inlineUiSchema,
  },
}
