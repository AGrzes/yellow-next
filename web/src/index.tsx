import React from 'react'

import { createRoot } from 'react-dom/client'
import 'reflect-metadata'
export function App() {
  return <>Hello Yellow!</>
}

const appElement = document.getElementById('root')
createRoot(appElement).render(<App />)
