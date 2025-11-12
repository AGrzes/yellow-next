import type { BoxProps } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import type { Content } from '@model/item.ts'
import { marked } from 'marked'

export function ContentDisplay({ content, ...boxProps }: { content: Content } & BoxProps) {
  if ('html' in content) {
    return <Box {...boxProps} dangerouslySetInnerHTML={{ __html: content.html }} />
  }
  return <Box {...boxProps} dangerouslySetInnerHTML={{ __html: marked.parse(content.markdown) }} />
}
