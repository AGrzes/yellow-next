import { Model } from '@agrzes/yellow-next-shared/access/dynamic'
import { SemanticModelOptions } from '@agrzes/yellow-next-shared/access/dynamic/semantic'
import jsonld from 'jsonld'
import { Store } from 'n3'
import React from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
import { PathDocument } from './PathDocument'

const StoreContext = React.createContext<Store>(undefined)
const ModelContext = React.createContext<Model>(undefined)

async function loadGraph(): Promise<Store> {
  return new Store((await jsonld.toRDF(await (await fetch('/graph')).json())) as any)
}

export function useStore(): Store {
  return React.useContext(StoreContext)
}

export function useModel(): Model {
  return React.useContext(ModelContext)
}

function Documents() {
  const store = useLoaderData() as Store
  const model = new Model(store, new SemanticModelOptions(store))
  return (
    <StoreContext.Provider value={store}>
      <ModelContext.Provider value={model}>
        <Outlet />
      </ModelContext.Provider>
    </StoreContext.Provider>
  )
}

const routes = [
  {
    path: 'documents',
    element: <Documents />,
    id: 'documents',
    loader: loadGraph,
    children: [{ path: '*', element: <PathDocument /> }],
  },
]

export default routes
