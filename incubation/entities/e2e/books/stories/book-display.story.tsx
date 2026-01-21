import type { Meta, StoryObj } from '@storybook/react-vite'
import { EntityDisplay } from '@v1/components/entity-display/EntityDisplay.tsx'

import { collections } from '../utils/data-browser.ts'
import { schemas } from '../utils/schema-browser.ts'
import { setupServices } from '../utils/setup-services.ts'
import { uiSchemas } from '../utils/ui-schema-browser.ts'

const { entityManager, uiSchemaManager } = await setupServices(collections, schemas, uiSchemas)

const meta = {
  component: EntityDisplay,
} satisfies Meta<typeof EntityDisplay>

export default meta
type Story = StoryObj<typeof meta>

export const Book: Story = {
  args: {
    entity: (await entityManager.get<any>(collections.book.type, collections.book.items[0].id))!,
  },
}

export const BookInline: Story = {
  args: {
    entity: (await entityManager.get<any>(collections.book.type, collections.book.items[0].id))!,
    uiSchema: (await uiSchemaManager.get(collections.book.type, 'inline'))!,
  },
}