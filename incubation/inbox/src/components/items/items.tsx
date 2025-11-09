import { Flex } from '@chakra-ui/react'
import type { Item } from '@model/item.ts'
import { ItemLine } from '../item/item.tsx'

export function ItemsList({ items }: { items: Item[] }) {
  return (
    <Flex direction="column" gap="1">
      {items.map((item) => (
        <ItemLine key={item.id} item={item} borderTopWidth="1px" borderTopColor="gray.300" />
      ))}
    </Flex>
  )
}
