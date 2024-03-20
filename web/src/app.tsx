import React from 'react'
import { RouterProvider, useParams } from 'react-router-dom'
import { Document } from './documents/Document'
import { router } from './router'

function CustomPathDocument({ path }: { path: string }) {
  const params = useParams()
  return <Document path={path} {...params} />
}

export function App() {
  return <RouterProvider router={router}></RouterProvider>
}
