import { createTheme, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import { router } from './routes/index.tsx'
import { createInboxService, InboxServiceProvider } from './service/inbox/index.ts'
export const theme = createTheme({})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <InboxServiceProvider value={createInboxService()}>
        <RouterProvider router={router} />
      </InboxServiceProvider>
    </MantineProvider>
  </StrictMode>
)
