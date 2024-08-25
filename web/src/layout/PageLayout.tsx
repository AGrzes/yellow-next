import { Box, CssBaseline, Divider, Fab, Grid, Icon, Stack } from '@mui/material'
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
  const [open, setOpen] = React.useState(true)
  const switchOpen = () => {
    setOpen(!open)
  }
  return (
    <>
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Stack direction="row" spacing={0}>
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
                display: open ? null : 'none',
                //borderRight: 'solid rgba(0, 0, 0, 0.12) 1px',
                flexGrow: 1,
              }}
            >
              {sidebar}
            </Box>
            <Divider orientation="vertical" flexItem />
          </Stack>
        </Grid>
        <Grid item xs={10}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  )
}
