import { Button, Input } from '@chakra-ui/react'
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
    <div>
      <Input
        onChange={(e) => setContent(e.target.value)}
        value={content}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            submit()
          }
        }}
      />
      <Button onClick={submit}>Add</Button>
    </div>
  )
}
