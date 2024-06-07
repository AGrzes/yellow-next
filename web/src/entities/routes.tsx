import React from 'react'
import { useParams } from 'react-router-dom'
import { PageLayout } from '../layout/PageLayout'
import { EntityClasses } from './EntityClasses'
import { EntityCollection } from './EntityCollection'
import { EntityDetails } from './EntityDetails'

function EntityCollectionRoute() {
  const { className } = useParams()
  return <EntityCollection className={className} />
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
      { path: ':className', element: <EntityCollectionRoute /> },
      { path: ':className/:iri', element: <EntityDetailsRoute /> },
    ],
  },
]

export default routes
