import type { BoxProps } from '@chakra-ui/react'
import { Box, Button, ButtonGroup, Flex, Icon, Spacer, Tag, Text, Wrap } from '@chakra-ui/react'
import type { Content, Item } from '@model/item.ts'
import { Check, MoreHorizontal } from 'lucide-react'
import { marked } from 'marked'

function ContentDisplay({ content, ...boxProps }: { content: Content } & BoxProps) {
  if ('html' in content) {
    return <Box {...boxProps} dangerouslySetInnerHTML={{ __html: content.html }} />
  }
  return <Box {...boxProps} dangerouslySetInnerHTML={{ __html: marked.parse(content.markdown) }} />
}

function ItemLabel({ labelKey, labelValue }: { labelKey: string; labelValue: string }) {
  return (
    <Tag.Root colorPalette={'blue'}>
      <Tag.Label>
        {labelKey}: {labelValue}
      </Tag.Label>
    </Tag.Root>
  )
}

export function ItemLine({ item, ...boxProps }: { item: Item } & BoxProps) {
  return (
    <Box {...boxProps} padding="1" position="relative" display="flex" alignItems="center">
      <Flex direction="column" alignItems="center" marginRight="4">
        <Text fontSize="sm" color="gray.500">
          {new Date(item.captured).toISOString().split('T')[0]}
        </Text>
        <Text fontSize="xs" color="gray.400">
          {new Date(item.captured).toISOString().split('T')[1].slice(0, 8)}
        </Text>
      </Flex>
      <Flex direction="column" flex="1">
        <Flex alignItems="center" gap="2">
          <Text fontSize="lg" fontWeight={item.read ? 'normal' : 'bold'}>
            {item.title}
          </Text>
          {item.labels && (
            <Wrap>
              {Object.entries(item.labels).map(([key, value]) => (
                <ItemLabel key={key} labelKey={key} labelValue={value} />
              ))}
            </Wrap>
          )}
        </Flex>
        {item.summary && <ContentDisplay content={item.summary} fontSize="sm" color="gray.500" />}
      </Flex>
      <Spacer />
      <ButtonGroup attached>
        <Button variant="ghost" colorScheme="green">
          <Icon>
            <Check size={16} />
          </Icon>
        </Button>
        <Button variant="ghost">
          <Icon>
            <MoreHorizontal size={16} />
          </Icon>
        </Button>
      </ButtonGroup>
    </Box>
  )
}
