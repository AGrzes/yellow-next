import * as React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { PathDocument } from './PathDocumnt.js'

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  { path: '/documents/*', element: <PathDocument /> },
])
