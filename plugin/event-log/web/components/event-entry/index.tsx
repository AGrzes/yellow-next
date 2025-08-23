import { Button, Input } from '@chakra-ui/react'
import { useState } from 'react'
import { usePostEntry } from '../../query/index.js'

export function EventEntry() {
  const postEntry = usePostEntry()
  const [content, setContent] = useState('')
  return (
    <div>
      <Input onChange={(e) => setContent(e.target.value)} value={content} />
      <Button
        onClick={() =>
          postEntry.mutate(
            { content },
            {
              onSuccess() {
                setContent('')
              },
            }
          )
        }
      >
        Add
      </Button>
    </div>
  )
}
