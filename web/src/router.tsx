import * as React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { PageLayout, pageLayoutLoader } from './PageLayout'
import { PathDocument } from './PathDocument'

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    element: <PageLayout />,
    loader: pageLayoutLoader,
    children: [{ path: '/documents/*', element: <PathDocument /> }],
  },
])
