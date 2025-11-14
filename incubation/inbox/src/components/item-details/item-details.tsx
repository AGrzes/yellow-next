import type { FlexProps } from '@mantine/core'
import { ActionIcon, Flex, Group, Text } from '@mantine/core'
import { ContentDisplay } from '@components/content-display/content-display.tsx'
import { DateDisplay } from '@components/date-display/date-display.tsx'
import { LabelDisplay } from '@components/label-display/label-display.tsx'
import type { Item } from '@model/item.ts'
import { Check, MoreHorizontal } from 'lucide-react'

export function ItemDetails({ item, ...boxProps }: { item: Item } & FlexProps) {
  const fontWeight = item.read ? 'normal' : 'bold'
  return (
    <Flex {...boxProps} direction="column" gap="sm">
      <Flex direction="row" wrap="wrap" flex="1" gap="sm" align="center">
        <DateDisplay date={item.captured} highlight={!item.read} />
        <Flex direction="row" wrap="wrap" flex="1" gap="sm" align="center">
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
        </Flex>
        <ActionIcon.Group>
          <ActionIcon variant="subtle" color="green" radius="md">
            <Check size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" radius="md">
            <MoreHorizontal size={16} />
          </ActionIcon>
        </ActionIcon.Group>
      </Flex>
      {item.summary && <ContentDisplay content={item.summary} fz="sm" c="dimmed" />}
      {item.details && <ContentDisplay content={item.details} fz="sm" />}
    </Flex>
  )
}
