import React, { FC, useEffect, useState } from 'react'

const documentExtensions = ['.mdx', '.md', '.tsx']

export function Document({ path, ...other }: { path: string }) {
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
  }, [path])

  return Component && <Component {...other} />
}
