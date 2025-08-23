import { Box, Flex } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { EventEntry } from '../components/event-entry/index.js'
import { LastEvents } from '../components/last-events/index.js'

export function EntryScreen() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    // Scroll to bottom helper
    const scrollToBottom = () => {
      el.scrollTop = el.scrollHeight
    }

    // Initial scroll
    scrollToBottom()

    // Observe DOM changes
    const observer = new window.MutationObserver(() => {
      scrollToBottom()
    })
    observer.observe(el, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return (
    <Flex direction="column" gap={4} p={4} h="100vh">
      <Box ref={scrollRef} flex={1} minH={0} overflowY="auto" display="flex" flexDirection="column">
        <LastEvents />
      </Box>
      <Box h="128px" flexShrink={0}>
        <EventEntry />
      </Box>
    </Flex>
  )
}
