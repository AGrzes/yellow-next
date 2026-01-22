import type { Meta, StoryObj } from '@storybook/react-vite'
import { EntityStaticList } from '@v1/components/entity-static-list/EntityStaticList.tsx'

import { collections } from '../utils/data-browser.ts'
import { schemas } from '../utils/schema-browser.ts'
import { setupServices } from '../utils/setup-services.ts'
import { uiSchemas } from '../utils/ui-schema-browser.ts'

const { entityManager, uiSchemaManager } = await setupServices(collections, schemas, uiSchemas)

const meta = {
  component: EntityStaticList,
} satisfies Meta<typeof EntityStaticList>

export default meta
type Story = StoryObj<typeof meta>

export const Books: Story = {
  args: {
    list: await entityManager.list<any>(collections.book.type),
  },
}
