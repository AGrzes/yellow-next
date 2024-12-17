import { Accordion, AccordionDetails, AccordionSummary, Box, Icon, Tab, Tabs } from '@mui/material'
import lodash from 'lodash'
import React, { useMemo } from 'react'
import { EntityComponentType } from '..'
import { CompositeEntityComponent } from '../CompositeEntityComponent'
const { groupBy, mapValues, upperFirst, camelCase, map } = lodash

export function accordion({
  property,
  header,
  content,
  groupProperty,
  groupLabels,
}: {
  property: string
  header: EntityComponentType[]
  content?: EntityComponentType[]
  label?: string
  groupProperty?: string
  groupLabels?: Record<string, string>
}): EntityComponentType {
  const EntityAccordion = ({ values, sx }) => {
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

  if (groupProperty) {
    return ({ entity, sx }) => {
      const groups = useMemo(() => groupBy(entity[property], (value) => value[groupProperty] || 'default'), [entity])
      groupLabels = groupLabels || mapValues(groups, (values, key) => upperFirst(camelCase(key)))
      const groupKeys = Object.keys(groups)
      const [selectedGroup, setSelectedGroup] = React.useState(0)
      const values = useMemo(() => groups[groupKeys[selectedGroup]], [selectedGroup])
      return (
        <Box sx={sx}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={selectedGroup}
              onChange={(event: React.SyntheticEvent, newValue: number) => setSelectedGroup(newValue)}
            >
              {map(groupKeys, (key) => (
                <Tab key={key} label={groupLabels[key]} />
              ))}
            </Tabs>
          </Box>
          <EntityAccordion values={values} sx={sx} />
        </Box>
      )
    }
  } else {
    return ({ entity, sx }) => {
      const values = useMemo((): any[] => entity[property] || [], [entity])
      return <EntityAccordion values={values} sx={sx} />
    }
  }
}
