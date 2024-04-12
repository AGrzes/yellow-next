import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { PageLayout } from '../layout/PageLayout'
import { PathDocument } from './PathDocument'
import { Toc } from './toc/Toc'
import { TocNode } from './toc/model'

function TocRoute() {
  const toc = useLoaderData() as TocNode[]
  return <Toc toc={toc} />
}

export async function tocLoader() {
  return await (await fetch('/toc')).json()
}

const routes = [
  {
    path: 'documents',
    element: <PageLayout sidebar={<TocRoute />} />,
    id: 'documents',
    loader: tocLoader,
    children: [{ path: '*', element: <PathDocument /> }],
  },
]

export default routes
