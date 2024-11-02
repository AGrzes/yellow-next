import { Box, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import React from 'react'
import { usePrint } from '../layout/index'

export function EntityDetailsTemplate({ title, content }: { title: any; content: any }) {
  const print = usePrint()
  return print ? (
    <Box>
      <Typography variant="h2" gutterBottom>
        {title}
      </Typography>
      {content}
    </Box>
  ) : (
    <Container maxWidth={false}>
      <Card>
        <CardHeader title={title}></CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    </Container>
  )
}
