import { Timeline } from '@chakra-ui/react'
import { useListEntries } from '../../query/index.js'

export function LastEvents() {
  const events = useListEntries()

  return (
    <Timeline.Root>
      {events.data?.map((event) => (
        <Timeline.Item key={event.id}>
          <Timeline.Connector>
            <Timeline.Separator />
            <Timeline.Indicator />
          </Timeline.Connector>
          <Timeline.Content>
            <Timeline.Title>{event.content}</Timeline.Title>
            <Timeline.Description>{event.createdAt}</Timeline.Description>
          </Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline.Root>
  )
}
