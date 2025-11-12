import type { BoxProps } from '@chakra-ui/react'
import { Box, Button, ButtonGroup, Flex, Icon, Text, Wrap } from '@chakra-ui/react'
import type { Item } from '@model/item.ts'
import { Check, MoreHorizontal } from 'lucide-react'
import { ContentDisplay } from '../content-display/content-display'
import { DateDisplay } from '../date-display/date-display'
import { LabelDisplay } from '../label-display/label-display'

export function ItemLine({ item, ...boxProps }: { item: Item } & BoxProps) {
  const fontWeight = item.read ? 'normal' : 'bold'
  return (
    <Box {...boxProps} padding="1" position="relative" display="flex" alignItems="center">
      <DateDisplay date={item.captured} highlight={!item.read} />
      <Flex direction="column" flex="1">
        <Flex alignItems="center" gap="2">
          <Text fontSize="lg" fontWeight={fontWeight}>
            {item.title}
          </Text>
          {item.labels && (
            <Wrap>
              {Object.entries(item.labels).map(([key, value]) => (
                <LabelDisplay key={key} labelKey={key} labelValue={value} />
              ))}
            </Wrap>
          )}
        </Flex>
        {item.summary && <ContentDisplay content={item.summary} fontSize="sm" color="gray.500" />}
      </Flex>
      {/* Replace Spacer with a Box that collapses when needed */}
      <Box flexShrink={1} />
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
