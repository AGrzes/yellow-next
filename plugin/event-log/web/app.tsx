import { RouterProvider } from '@tanstack/react-router'
import React from 'react'
import { router } from './router.js'

export function App() {
  return <RouterProvider router={router} />
}
