import type { BoxProps } from '@chakra-ui/react'
import { Box, Button, ButtonGroup, Flex, Icon, Spacer, Tag, Text, Wrap } from '@chakra-ui/react'
import type { Item } from '@model/item.ts'
import { Check, MoreHorizontal } from 'lucide-react'
import { ContentDisplay } from '../content-display/content-display'

function ItemLabel({ labelKey, labelValue }: { labelKey: string; labelValue: string }) {
  return (
    <Tag.Root colorPalette={'blue'}>
      <Tag.Label>
        {labelKey}: {labelValue}
      </Tag.Label>
    </Tag.Root>
  )
}

function CapturedDate({ date, highlight }: { date: string; highlight: boolean }) {
  const formattedDate = new Date(date).toISOString()
  const datePart = formattedDate.split('T')[0]
  const timePart = formattedDate.split('T')[1].slice(0, 8)
  const fontWeight = highlight ? 'bold' : 'normal'

  return (
    <Flex direction={{ base: 'column', md: 'row' }} alignItems="center" marginRight="4">
      <Text fontSize="sm" color="gray.500" fontWeight={fontWeight}>
        {datePart}
      </Text>
      <Text
        fontSize={{ base: 'xs', md: 'sm' }}
        color={{ base: 'gray.500', md: 'gray.400' }}
        marginLeft={{ base: '0', md: '2' }}
        fontWeight={fontWeight}
      >
        {timePart}
      </Text>
    </Flex>
  )
}

export function ItemLine({ item, ...boxProps }: { item: Item } & BoxProps) {
  const fontWeight = item.read ? 'normal' : 'bold'
  return (
    <Box {...boxProps} padding="1" position="relative" display="flex" alignItems="center">
      <CapturedDate date={item.captured} highlight={!item.read} />
      <Flex direction="column" flex="1">
        <Flex alignItems="center" gap="2">
          <Text fontSize="lg" fontWeight={fontWeight}>
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
