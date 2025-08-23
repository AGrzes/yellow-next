import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { EventEntry } from '../model/index.js'
import eventService from '../service/event.js'

export function usePostEntry() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (entry: EventEntry) => {
      await eventService.create(entry)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
  return mutation
}

export function useListEntries() {
  const query = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      return await eventService.list()
    },
  })
  return query
}

export function useGetEntry(id: string) {
  const query = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      return await eventService.get(id)
    },
  })
  return query
}
