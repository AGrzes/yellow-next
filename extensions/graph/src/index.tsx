import { Paper } from '@mui/material'
import React from 'react'
import { GraphCanvas } from 'reagraph'

export function entityGraph() {
  return () => {
    return (
      <Paper sx={{ height: 400, position: 'relative' }}>
        <GraphCanvas
          nodes={[
            { id: 'a', label: 'Node A' },
            { id: 'b', label: 'Node B' },
            { id: 'c', label: 'Node C' },
            { id: 'd', label: 'Node D' },
          ]}
          edges={[
            { id: 'ab', source: 'a', target: 'b' },
            { id: 'bc', source: 'b', target: 'c' },
            { id: 'cd', source: 'c', target: 'd' },
          ]}
        />
      </Paper>
    )
  }
}
