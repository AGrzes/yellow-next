import { MantineProvider } from '@mantine/core'
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
      <MantineProvider defaultColorScheme="light">
        <Story />
      </MantineProvider>
    ),
  ],
}

export default preview
