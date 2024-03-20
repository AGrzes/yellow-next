import * as React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import documentsRoutes from './documents/routes'
import { PageLayout, pageLayoutLoader } from './layout/PageLayout'

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    element: <PageLayout />,
    loader: pageLayoutLoader,
    children: [...documentsRoutes],
  },
])
