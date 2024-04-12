import { Model } from '@agrzes/yellow-next-shared/dynamic/access'
import { SemanticModelOptions } from '@agrzes/yellow-next-shared/dynamic/semantic'
import { Store } from 'n3'
import React from 'react'
export const ModelContext = React.createContext<Model>(undefined)

export function useModel(): Model {
  return React.useContext(ModelContext)
}

export function createModel(store: Store): Model {
  return new Model(store, new SemanticModelOptions(store))
}
