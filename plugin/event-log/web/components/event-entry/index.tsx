import { Button, HStack, Input } from '@chakra-ui/react'
import { useState } from 'react'
import { usePostEntry } from '../../query/index.js'

export function EventEntry() {
  const postEntry = usePostEntry()
  const [content, setContent] = useState('')

  const submit = () => {
    postEntry.mutate(
      { content },
      {
        onSuccess() {
          setContent('')
        },
      }
    )
  }
  return (
    <HStack gap={2} align="center">
      <Input
        onChange={(e) => setContent(e.target.value)}
        value={content}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            submit()
          }
        }}
        placeholder="Add new event..."
        flex={1}
        disabled={postEntry.isPending}
      />
      <Button onClick={submit} loading={postEntry.isPending}>
        Add
      </Button>
    </HStack>
  )
}
