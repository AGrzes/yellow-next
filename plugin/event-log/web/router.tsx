import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { EntryScreen } from './screens/entry.js'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    )
  },
})

const entryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entry',
  component: EntryScreen,
})

const routeTree = rootRoute.addChildren([indexRoute, entryRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
