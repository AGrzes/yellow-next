import * as React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { PathDocument } from './PathDocument'
import { PageLayout, pageLayoutLoader } from './layout/PageLayout'

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    element: <PageLayout />,
    loader: pageLayoutLoader,
    children: [{ path: '/documents/*', element: <PathDocument /> }],
  },
])
