import { Box, Container, CssBaseline, Divider, Fab, Icon, Stack } from '@mui/material'
import React from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
import './PageLayout.scss'
import { Toc } from './toc/Toc'
import { TocNode } from './toc/model'

export function PageLayout() {
  const toc = useLoaderData() as TocNode[]
  const [open, setOpen] = React.useState('toc')
  const switchOpen = (key: string) => () => {
    if (open === key) {
      setOpen('')
    } else {
      setOpen(key)
    }
  }
  return (
    <>
      <CssBaseline />
      <Stack direction="row" spacing={0} sx={{ position: 'fixed', top: 0, left: 0, height: 1 }}>
        <Box sx={{ padding: 1 }}>
          <Stack direction="column" onClick={switchOpen('toc')}>
            <Fab size="large" color="primary">
              <Icon>toc</Icon>
            </Fab>
          </Stack>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Toc
          toc={toc}
          sx={{
            minWidth: 100,
            display: open === 'toc' ? null : 'none',
            borderRight: 'solid rgba(0, 0, 0, 0.12) 1px',
          }}
        />
      </Stack>
      <Container>
        <Outlet />
      </Container>
    </>
  )
}

export async function pageLayoutLoader() {
  return await (await fetch('/toc')).json()
}
