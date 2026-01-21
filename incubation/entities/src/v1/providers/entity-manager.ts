import { createContext, useContext } from 'react'
import type { EntityManager } from '../../service/index.ts'

const ENTITY_MANGER = createContext<EntityManager | undefined>(undefined)

export const EntityManagerProvider = ENTITY_MANGER.Provider

export function useEntityManager() {
  const entityManager = useContext(ENTITY_MANGER)
  if (!entityManager) {
    throw new Error('useEntityManager must be used within a EntityManagerProvider')
  }
  return entityManager
}
