import { Timeline } from '@chakra-ui/react'
import { DateTime } from 'luxon'
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
            <Timeline.Description>
              {event.createdAt && DateTime.fromISO(event.createdAt).toFormat('yyyy-MM-dd HH:mm')}
            </Timeline.Description>
          </Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline.Root>
  )
}
