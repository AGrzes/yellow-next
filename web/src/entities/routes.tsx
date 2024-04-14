import React from 'react'
import { useParams } from 'react-router-dom'
import { PageLayout } from '../layout/PageLayout'
import { EntityClasses } from './EntityClasses'
import { EntityDetails } from './EntityDetails'
import { EntityList } from './EntityList'

function EntityListRoute() {
  const { className } = useParams()
  return <EntityList className={className} />
}
function EntityDetailsRoute() {
  const { className, iri } = useParams()
  return <EntityDetails className={className} iri={decodeURIComponent(iri)} />
}

const routes = [
  {
    path: 'entities',
    element: <PageLayout sidebar={<EntityClasses />} />,
    id: 'entities',
    children: [
      { path: ':className', element: <EntityListRoute /> },
      { path: ':className/:iri', element: <EntityDetailsRoute /> },
    ],
  },
]

export default routes
