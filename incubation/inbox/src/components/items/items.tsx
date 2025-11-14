import { Stack } from '@mantine/core'
import type { Item } from '@model/item.ts'
import { ItemLine } from '../item/item.tsx'

export function ItemsList({ items }: { items: Item[] }) {
  return (
    <Stack gap="xs">
      {items.map((item) => (
        <ItemLine key={item.id} item={item} style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }} />
      ))}
    </Stack>
  )
}
