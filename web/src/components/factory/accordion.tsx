import { Accordion, AccordionDetails, AccordionSummary, Box, Icon } from '@mui/material'
import React, { useMemo } from 'react'
import { EntityComponentType } from '..'
import { CompositeEntityComponent } from '../CompositeEntityComponent'

export function accordion({
  property,
  header,
  content,
}: {
  property: string
  header: EntityComponentType[]
  content?: EntityComponentType[]
  label?: string
}): EntityComponentType {
  return ({ entity, sx }) => {
    const values = useMemo((): any[] => entity[property] || [], [entity])
    const [expanded, setExpanded] = React.useState<string | false>(0)
    return (
      !!values.length && (
        <Box sx={sx}>
          {values.map((value: any, key: number) => (
            <Accordion
              expanded={expanded === key}
              key={key}
              sx={{
                border: `1px solid rgba(0, 0, 0, .125)`,
                borderBottom: () => (key !== values.length - 1 ? 0 : undefined),
              }}
              disableGutters
            >
              <AccordionSummary
                onClick={() => setExpanded(key)}
                sx={{ backgroundColor: 'rgba(0, 0, 0, .03)' }}
                expandIcon={<Icon>keyboard_arrow_up</Icon>}
              >
                <CompositeEntityComponent entity={value} items={header} direction="row" />
              </AccordionSummary>
              <AccordionDetails sx={{ borderTop: '1px solid rgba(0, 0, 0, .125)' }}>
                <CompositeEntityComponent entity={value} items={content} direction="row" />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )
    )
  }
}
