import { Stack } from '@mantine/core'
import type { Item } from '@model/item.ts'
import { ItemLine } from '../item/item.tsx'

export function ItemsList({ items }: { items: Item[] }) {
  return (
    <Stack gap={0} style={{ width: '100%' }}>
      {items.map((item) => (
        <ItemLine
          key={item.id}
          item={item}
          style={{ width: '100%', borderTop: '1px solid var(--mantine-color-gray-3)', padding: '0' }}
        />
      ))}
    </Stack>
  )
}
