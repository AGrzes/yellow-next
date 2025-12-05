import { createBrowserRouter } from 'react-router'
import { Collection } from './Collection.tsx'
import { Item } from './Item.tsx'

export const router = createBrowserRouter([
  {
    path: '/:id',
    element: <Item />,
    loader: async ({params}) => ({ item: params.id }),
  },
  {
    path: '/',
    element: <Collection />,
  },
])
