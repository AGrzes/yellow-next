import React from 'react'
import { PageLayout } from '../layout/PageLayout'
import { EntityClasses } from './EntityClasses'

export async function tocLoader() {
  return await (await fetch('/toc')).json()
}

const routes = [
  {
    path: 'entities',
    element: <PageLayout sidebar={<EntityClasses />} />,
    id: 'entities',
    loader: tocLoader,
    children: [
      /*{ path: '*', element: <PathDocument /> }*/
    ],
  },
]

export default routes
