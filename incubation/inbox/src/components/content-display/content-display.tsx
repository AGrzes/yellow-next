import type { BoxProps } from '@mantine/core'
import { Box } from '@mantine/core'
import type { Content } from '@model/item.ts'
import { marked } from 'marked'
import styles from './content-display.module.css'

export function ContentDisplay({ content, ...boxProps }: { content: Content } & BoxProps) {
  if ('html' in content) {
    return <Box {...boxProps} dangerouslySetInnerHTML={{ __html: content.html }} className={styles.block} />
  }
  return (
    <Box {...boxProps} dangerouslySetInnerHTML={{ __html: marked.parse(content.markdown) }} className={styles.block} />
  )
}
