import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router.js'

export function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <RouterProvider router={router} />
    </ChakraProvider>
  )
}
