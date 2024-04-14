import React from 'react'
import { useParams } from 'react-router-dom'
import { PageLayout } from '../layout/PageLayout'
import { EntityClasses } from './EntityClasses'
import { EntityList } from './EntityList'

function EntityListRoute() {
  const { className } = useParams()
  return <EntityList className={className} />
}

const routes = [
  {
    path: 'entities',
    element: <PageLayout sidebar={<EntityClasses />} />,
    id: 'entities',
    children: [{ path: ':className', element: <EntityListRoute /> }],
  },
]

export default routes
