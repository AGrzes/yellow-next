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

export const Series: Story = {
  args: {
    entity: (await entityManager.get<any>(collections.series.type, collections.series.items[0].id))!,
  },
}
