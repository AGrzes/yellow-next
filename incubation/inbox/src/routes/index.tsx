import { type ComponentType } from 'react'
import { createBrowserRouter, useLoaderData } from 'react-router'
import App from '../App.tsx'
import { createInboxService } from '../service/inbox/index.ts'

function withLoaderData<P>(Component: ComponentType<P>) {
  const Wrapped = () => {
    const data = useLoaderData()
    return <Component {...data} />
  }
  return <Wrapped />
}
const inboxService = createInboxService()

export const router = createBrowserRouter([
  {
    path: '/',
    element: withLoaderData(App),
    loader: async () => ({ items: await inboxService.list() }),
  },
])
