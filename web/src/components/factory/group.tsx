import { Accordion, AccordionDetails, AccordionSummary, Box, Icon, SxProps, Tab, Tabs, Theme } from '@mui/material'
import lodash from 'lodash'
import React from 'react'
import { EntityComponentType } from '../index.js'
export interface GroupEntry {
  Header: React.FC
  Content: React.FC
}

export type GroupWrapper = React.FC<{ entries: GroupEntry[] }>

export type generator = (entity: any) => GroupEntry[]

export function group(generator: (entity: any) => GroupEntry[], Wrapper: GroupWrapper): EntityComponentType {
  return ({ entity }) => {
    const entries = generator(entity)
    return <Wrapper entries={entries} />
  }
}

export function concatenate(...generators: generator[]): generator {
  return (entity) => generators.flatMap((generator) => generator(entity))
}

export function simple(Header: EntityComponentType, Content: EntityComponentType): generator {
  return (entity) => [{ Header: () => <Header entity={entity} />, Content: () => <Content entity={entity} /> }]
}

export function iterate(property: string, Header: EntityComponentType, Content: EntityComponentType): generator {
  return (entity) =>
    entity[property].map((value: any) => ({
      Header: () => <Header entity={value} />,
      Content: () => <Content entity={value} />,
    }))
}

export function groupBy(
  property: string,
  groupProperty: string,
  GroupHeader: React.FC<{ group: string }>,
  Header: EntityComponentType,
  Content: EntityComponentType,
  Wrapper: GroupWrapper
): generator {
  return (entity) => {
    const groups = lodash.groupBy(entity[property], groupProperty)
    return lodash.map(groups, (group, key) => ({
      Header: () => <GroupHeader group={key} />,
      Content: () => (
        <Wrapper
          entries={group.map((value: any) => ({
            Header: () => <Header entity={value} />,
            Content: () => <Content entity={value} />,
          }))}
        />
      ),
    }))
  }
}

export function AccordionWrapper({ entries, sx }: { entries: GroupEntry[]; sx?: SxProps<Theme> }) {
  const [expanded, setExpanded] = React.useState<number>(0)
  return (
    <Box sx={sx}>
      {entries.map(({ Header, Content }, key) => (
        <Accordion
          key={key}
          expanded={expanded === key}
          sx={{
            border: `1px solid rgba(0, 0, 0, .125)`,
            borderBottom: () => (key !== entries.length - 1 ? 0 : undefined),
          }}
          disableGutters
        >
          <AccordionSummary
            onClick={() => setExpanded(key)}
            sx={{ backgroundColor: 'rgba(0, 0, 0, .03)' }}
            expandIcon={<Icon>keyboard_arrow_up</Icon>}
          >
            <Header />
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: '1px solid rgba(0, 0, 0, .125)' }}>
            <Content />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export function TabsWrapper({ entries, sx }: { entries: GroupEntry[]; sx?: SxProps<Theme> }) {
  const [selectedGroup, setSelectedGroup] = React.useState(0)
  const Content = entries[selectedGroup].Content
  return (
    <Box sx={sx}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 1 }}>
        <Tabs
          value={selectedGroup}
          onChange={(event: React.SyntheticEvent, newValue: number) => setSelectedGroup(newValue)}
        >
          {lodash.map(entries, ({ Header }, key) => (
            <Tab key={key} label={<Header />} />
          ))}
        </Tabs>
      </Box>
      <Content />
    </Box>
  )
}
