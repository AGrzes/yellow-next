import type { FlexProps } from '@mantine/core'
import { ActionIcon, Flex, Group, Text } from '@mantine/core'
import type { Item } from '@model/item.ts'
import { Check, MoreHorizontal } from 'lucide-react'
import { ContentDisplay } from '../content-display/content-display'
import { DateDisplay } from '../date-display/date-display'
import { LabelDisplay } from '../label-display/label-display'

export function ItemLine({ item, ...flexProps }: { item: Item } & FlexProps) {
  const fontWeight = item.read ? 'normal' : 'bold'
  return (
    <Flex {...flexProps} align="center" wrap="wrap" gap="sm">
      <DateDisplay date={item.captured} highlight={!item.read} />
      <Flex direction="row" wrap="wrap" flex="1" gap="0" align="center">
        <Text size="lg" fw={fontWeight} style={{ flexShrink: 0 }}>
          {item.title}
        </Text>
        {item.labels && (
          <Group gap="xs" wrap="wrap" style={{ flexShrink: 1, minWidth: 0 }}>
            {Object.entries(item.labels).map(([key, value]) => (
              <LabelDisplay key={key} labelKey={key} labelValue={value} />
            ))}
          </Group>
        )}
        {item.summary && (
          <ContentDisplay content={item.summary} style={{ flexShrink: 1, minWidth: 0 }} c="dimmed" fz="sm" />
        )}
      </Flex>
      <ActionIcon.Group>
        <ActionIcon variant="subtle" radius="md">
          <Check size={16} />
        </ActionIcon>
        <ActionIcon variant="subtle" radius="md">
          <MoreHorizontal size={16} />
        </ActionIcon>
      </ActionIcon.Group>
    </Flex>
  )
}
