import { SemanticProxy } from '@agrzes/yellow-next-shared/dynamic/access'
import React from 'react'

export const ConfigContext = React.createContext<Config>({})

export async function config<T extends Record<string, any>>(): Promise<T> {
  try {
    return (await import(`@config/web.ts`)) as T
  } catch (error) {
    return {} as T
  }
}

export interface Config {
  classConfig?: Record<string, ClassConfig<any>>
}

export interface ClassConfig<T extends SemanticProxy> {
  defaultCollectionDisplay?: string
  treeOptions?: {
    children: (parent: T) => T[]
    parent: (child: T) => T
  }
  icon?: string
}

export function useConfig(): Config {
  return React.useContext(ConfigContext)
}

export function useClassConfig<T extends SemanticProxy>(className: string): ClassConfig<T> {
  const config = useConfig()
  return config.classConfig?.[className] || {}
}
