import React, { FC, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'

const documentExtensions = ['.mdx', '.md', '.tsx']

function Document({ path, ...other }: { path: string }) {
  const [Component, setComponent] = useState<FC>()
  useEffect(() => {
    const loadComponent = async () => {
      let component: FC
      // @ts-ignore
      for (const extension of documentExtensions) {
        try {
          component = (await import(/* webpackInclude: /\.(mdx|tsx|md)$/ */ `@documents/${path}${extension}`)).default
          break
        } catch (error) {
          console.error(error)
        }
      }

      if (!component) {
        component = () => <div>Not found</div>
      }
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
