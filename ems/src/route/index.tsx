import React from 'react'
import { Ems } from '../components/Ems'
import { store } from '../service/store/index'
import { withLoader } from '../utils/routeComponents'

const RouterEms = withLoader(Ems)

const routes = [
  {
    path: 'ems/:id',
    loader: async ({ params }: { params: { id: string } }) => {
      return {
        item: (await store.get(params.id))[0],
      }
    },
    element: <RouterEms />,
    id: 'ems',
  },
]

export default routes
