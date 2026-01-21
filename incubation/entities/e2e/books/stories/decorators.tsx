import { type EntityManager } from '@v1/entity'
import { EntityManagerProvider } from '@v1/providers/entity-manager'
import { UiSchemaManagerProvider } from '@v1/providers/ui-schema-manager'
import { UiSchemaManager } from '@v1/schema/ui-schema-manager'

export function withServices(entityManager: EntityManager, uiSchemaManager: UiSchemaManager) {
  return function StoryDecorator(StoryComponent: any) {
    return (
      <EntityManagerProvider value={entityManager}>
        <UiSchemaManagerProvider value={uiSchemaManager}>
          <StoryComponent />
        </UiSchemaManagerProvider>
      </EntityManagerProvider>
    )
  }
}
