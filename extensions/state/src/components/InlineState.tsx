import Badge from '@mui/material/Badge'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import lodash from 'lodash'
import React, { useState } from 'react'
const { last, filter } = lodash

export function InlineState({ state }: { state: any[] }) {
  const [showDetails, setShowDetails] = useState(false)

  const currentState = last(filter(state, (s) => s.state))
  return (
    currentState && (
      <>
        <Badge badgeContent={state.length} color="primary" showZero>
          <Chip size="small" variant="outlined" label={currentState.state} onClick={() => setShowDetails(true)} />
        </Badge>
        {showDetails && (
          <Dialog open={showDetails} onClose={() => setShowDetails(false)}>
            <Table>
              <TableBody>
                {state.map((s, key) => (
                  <TableRow key={key}>
                    <TableCell>{s.state}</TableCell>
                    <TableCell>{s.date}</TableCell>
                    <TableCell>{s.comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Dialog>
        )}
      </>
    )
  )
}
