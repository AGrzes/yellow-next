import type { UiSchemaManager } from '@v1/schema/ui-schema-manager.ts'
import { createContext, useContext } from 'react'

const UI_SCHEMA_MANAGER = createContext<UiSchemaManager | undefined>(undefined)

export const UiSchemaManagerProvider = UI_SCHEMA_MANAGER.Provider

export function useUiSchemaManager() {
  const entityManager = useContext(UI_SCHEMA_MANAGER)
  if (!entityManager) {
    throw new Error('useUiSchemaManager must be used within a UiSchemaManagerProvider')
  }
  return entityManager
}
