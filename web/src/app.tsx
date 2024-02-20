import React, { FC, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'

function Document({ path, ...other }: { path: string }) {
  const [Component, setComponent] = useState<FC>()
  useEffect(() => {
    const loadComponent = async () => {
      // @ts-ignore
      const component = (await import(/* webpackInclude: /\.mdx$/ */ `@documents/${path}.mdx`)).default
      setComponent(() => component)
    }
    loadComponent().catch(console.error)
  })

  return Component && <Component {...other} />
}

function PathDocument() {
  const { '*': path } = useParams()
  return <Document path={path} />
}
function CustomPathDocument({ path }: { path: string }) {
  const params = useParams()
  return <Document path={path} {...params} />
}

export function App() {
  return <AppRouter></AppRouter>
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/documents/*" element={<PathDocument />} />
      </Routes>
    </BrowserRouter>
  )
}
