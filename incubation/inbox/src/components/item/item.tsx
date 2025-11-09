import type { BoxProps } from '@chakra-ui/react'
import { Box, Button, ButtonGroup, Flex, Icon, Tag, Text, Wrap } from '@chakra-ui/react'
import type { Content, Item } from '@model/item.ts'
import { Check, MoreHorizontal } from 'lucide-react'

function ContentDisplay({ content, ...boxProps }: { content: Content } & BoxProps) {
  if ('html' in content) {
    return <Box {...boxProps} dangerouslySetInnerHTML={{ __html: content.html }} />
  }
  return (
    <Box as="pre" {...boxProps}>
      {content.markdown}
    </Box>
  )
}

function ItemLabel({ labelKey, labelValue }: { labelKey: string; labelValue: string }) {
  return (
    <Tag.Root>
      <Tag.Label>
        {labelKey}: {labelValue}
      </Tag.Label>
    </Tag.Root>
  )
}

export function ItemLine({ item }: { item: Item }) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      padding="4"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
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
      <ButtonGroup attached position="absolute" right="4" top="50%" transform="translateY(-50%)">
        <Button variant="outline" colorScheme="green">
          <Icon>
            <Check size={16} />
          </Icon>
        </Button>
        <Button variant="outline">
          <Icon>
            <MoreHorizontal size={16} />
          </Icon>
        </Button>
      </ButtonGroup>
    </Box>
  )
}
