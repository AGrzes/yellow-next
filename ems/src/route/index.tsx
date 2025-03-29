import React from 'react'
import { Ems } from '../components/Ems'
import { withParams } from '../components/routeComponents'

const RouterEms = withParams(Ems)

const routes = [
  {
    path: 'ems/:id',

    element: <RouterEms />,
    id: 'ems',
  },
]

export default routes
