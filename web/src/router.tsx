import { Store } from 'n3'
import * as React from 'react'
import { Outlet, createBrowserRouter, useLoaderData } from 'react-router-dom'
import documentsRoutes from './documents/routes'
import { ModelContext, createModel } from './model/index'
import { StoreContext, loadGraph } from './store/index'

export function StoreAndModel() {
  const store = useLoaderData() as Store
  const model = createModel(store)
  return (
    <StoreContext.Provider value={store}>
      <ModelContext.Provider value={model}>
        <Outlet />
      </ModelContext.Provider>
    </StoreContext.Provider>
  )
}

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    element: <StoreAndModel />,
    loader: loadGraph,
    children: [...documentsRoutes],
  },
])
