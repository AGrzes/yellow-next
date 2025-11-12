import type { FlexProps } from '@chakra-ui/react'
import { Box, ButtonGroup, Flex, Icon, IconButton, Text, Wrap } from '@chakra-ui/react'
import { ContentDisplay } from '@components/content-display/content-display.tsx'
import { DateDisplay } from '@components/date-display/date-display.tsx'
import { LabelDisplay } from '@components/label-display/label-display.tsx'
import type { Item } from '@model/item.ts'
import { Check, MoreHorizontal } from 'lucide-react'

export function ItemDetails({ item, ...boxProps }: { item: Item } & FlexProps) {
  const fontWeight = item.read ? 'normal' : 'bold'
  return (
    <Flex {...boxProps} direction="column">
      <Flex direction="row" flexWrap="wrap" flex="1" gap="2" alignItems="center">
        <DateDisplay date={item.captured} highlight={!item.read} />
        <Flex direction="row" flexWrap="wrap" flex="1" gap="2" alignItems="center">
          <Text fontSize="lg" fontWeight={fontWeight} flexShrink={0}>
            {item.title}
          </Text>
          {item.labels && (
            <Wrap flexShrink={1} minWidth="0">
              {Object.entries(item.labels).map(([key, value]) => (
                <LabelDisplay key={key} labelKey={key} labelValue={value} />
              ))}
            </Wrap>
          )}
        </Flex>
        <Box flexShrink={1} />
        <ButtonGroup attached>
          <IconButton variant="ghost" colorScheme="green">
            <Icon>
              <Check size={16} />
            </Icon>
          </IconButton>
          <IconButton variant="ghost">
            <Icon>
              <MoreHorizontal size={16} />
            </Icon>
          </IconButton>
        </ButtonGroup>
      </Flex>
      {item.summary && <ContentDisplay content={item.summary} fontSize="sm" color="gray.500" />}
      {item.details && <ContentDisplay content={item.details} fontSize="sm" />}
    </Flex>
  )
}
