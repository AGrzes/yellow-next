import { createBrowserRouter } from 'react-router'
import { Collection } from './Collection.tsx'
import { Item, itemLoader } from './Item.tsx'

export const router = createBrowserRouter([
  {
    path: '/:id',
    element: <Item />,
    loader: itemLoader,
  },
  {
    path: '/',
    element: <Collection />,
  },
])
