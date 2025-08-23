import { Stack } from '@chakra-ui/react'
import { useListEntries } from '../../query/index.js'

export function LastEvents() {
  const events = useListEntries()

  return (
    <Stack dir="column" gap={1}>
      {events.data?.map((event) => (
        <div key={event.id}>
          <small>{event.createdAt}</small>
          <span>{event.content}</span>
        </div>
      ))}
    </Stack>
  )
}
