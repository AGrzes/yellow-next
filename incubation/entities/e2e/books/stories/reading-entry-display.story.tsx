import type { Meta, StoryObj } from '@storybook/react-vite'
import { EntityDisplay } from '@v1/components/entity-display/EntityDisplay.tsx'

import { collections } from '../utils/data-browser.ts'
import { schemas } from '../utils/schema-browser.ts'
import { setupServices } from '../utils/setup-services.ts'
import { uiSchemas } from '../utils/ui-schema-browser.ts'

const { entityManager } = await setupServices(collections, schemas, uiSchemas)

const meta = {
  component: EntityDisplay,
} satisfies Meta<typeof EntityDisplay>

export default meta
type Story = StoryObj<typeof meta>

export const ReadingEntry: Story = {
  args: {
    entity: (await entityManager.get<any>(
      collections['reading-entry'].type,
      collections['reading-entry'].items[0].id
    ))!,
  },
}
