import { Box, Flex } from '@chakra-ui/react'
import { EventEntry } from '../components/event-entry/index.js'
import { LastEvents } from '../components/last-events/index.js'

export function EntryScreen() {
  return (
    <Flex direction="column" gap={4} p={4} h="100vh">
      <Box flex={1} minH={0}>
        <LastEvents />
      </Box>
      <Box h="128px" flexShrink={0}>
        <EventEntry />
      </Box>
    </Flex>
  )
}
