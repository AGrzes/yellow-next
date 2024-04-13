import { Box, Container, CssBaseline, Divider, Fab, Icon, Stack } from '@mui/material'
import React from 'react'
import { Link, Outlet, useMatches } from 'react-router-dom'
import './PageLayout.scss'

const menu = [
  {
    icon: 'toc',
    pathname: '/documents',
  },
  {
    icon: 'category',
    pathname: '/entities',
  },
]

export function PageLayout({ sidebar }: { sidebar: React.ReactNode }) {
  const matches = useMatches()
  console.log(matches)
  const [open, setOpen] = React.useState(true)
  const switchOpen = () => {
    setOpen(!open)
  }
  return (
    <>
      <CssBaseline />
      <Stack direction="row" spacing={0} sx={{ position: 'fixed', top: 0, left: 0, height: 1 }}>
        <Box sx={{ padding: 1 }}>
          <Stack direction="column" spacing={1}>
            {menu.map((item) =>
              item.pathname === matches[1].pathname ? (
                <Fab size="large" color="primary" key={item.pathname} onClick={switchOpen}>
                  <Icon>{item.icon}</Icon>
                </Fab>
              ) : (
                <Link to={item.pathname} key={item.pathname}>
                  <Fab size="large" color="primary">
                    <Icon>{item.icon}</Icon>
                  </Fab>
                </Link>
              )
            )}
          </Stack>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box
          sx={{
            minWidth: 100,
            display: open ? null : 'none',
            borderRight: 'solid rgba(0, 0, 0, 0.12) 1px',
          }}
        >
          {sidebar}
        </Box>
      </Stack>
      <Container>
        <Outlet />
      </Container>
    </>
  )
}
