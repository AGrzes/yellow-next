import React from 'react'
import { useParams } from 'react-router-dom'
import { EntityDetails } from '../components'
import { PageLayout } from '../layout/PageLayout'
import { EntityClasses } from './EntityClasses'
import { EntityCollection } from './EntityCollection'

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
