import { Box, Container, CssBaseline, Divider, Fab, Icon, Link, Stack } from '@mui/material'
import React from 'react'
import { Outlet, Link as RouterLink, useLoaderData } from 'react-router-dom'
import './PageLayout.scss'

interface TocNode {
  href: string
  label: string
  children: TocNode[]
}

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
        <Box
          sx={{
            minWidth: 100,
            padding: 1,
            display: open === 'toc' ? 'flex' : 'none',
            borderRight: 'solid rgba(0, 0, 0, 0.12) 1px',
          }}
        >
          <Stack direction="column">
            {toc.map((item: TocNode, index) =>
              item.href ? (
                <Link
                  component={RouterLink}
                  to={`/documents/${item.href}`}
                  variant="body2"
                  key={item.href || `${item.label}-${index}`}
                  sx={{ padding: 0.25 }}
                >
                  {item.label}
                </Link>
              ) : (
                <Box key={item.href || `${item.label}-${index}`}> {item.label}</Box>
              )
            )}
          </Stack>
        </Box>
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
