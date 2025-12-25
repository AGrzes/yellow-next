import { createTheme, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import type { Preview } from '@storybook/react-vite'

export const theme = createTheme({})

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
      <MantineProvider theme={theme}>
        <Story />
      </MantineProvider>
    ),
  ],
}

export default preview
