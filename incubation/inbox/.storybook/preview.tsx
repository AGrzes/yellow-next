import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import type { Preview } from '@storybook/react-vite'
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ChakraProvider value={defaultSystem}>
        <Story />
      </ChakraProvider>
    ),
  ],
}

export default preview
