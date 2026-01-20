import type { Meta, StoryObj } from '@storybook/react-vite'
import { EntityDisplay } from './EntityDisplay.tsx'

import { collections } from './data-browser.ts'
import { schemas } from './schema-browser.ts'
import { setupEntityManager } from './setup-entity-manager.ts'

const entityManager = await setupEntityManager(collections, schemas)

const meta = {
  component: EntityDisplay,
} satisfies Meta<typeof EntityDisplay>

export default meta
type Story = StoryObj<typeof meta>

export const Author: Story = {
  args: {
    entity: (await entityManager.get<any>(collections.author.type, collections.author.items[0].id))!,
  },
}
