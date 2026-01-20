import type { Meta, StoryObj } from '@storybook/react-vite'
import { EntityDisplay } from './EntityDisplay.tsx'

import { collections } from '../utils/data-browser.ts'
import { schemas } from '../utils/schema-browser.ts'
import { setupEntityManager } from '../utils/setup-entity-manager.ts'

const entityManager = await setupEntityManager(collections, schemas)

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
