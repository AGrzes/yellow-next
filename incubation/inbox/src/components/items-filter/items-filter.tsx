import { Flex, Select, Text } from '@mantine/core'
export interface ItemsFilterSpec {
  resolved?: 'all' | 'recently' | 'none'
  read?: 'all' | 'read' | 'unread'
}

export function ItemsFilter({
  value,
  onChange,
}: {
  value: ItemsFilterSpec
  onChange: (newValue: ItemsFilterSpec) => void
}) {
  return (
    <Flex p="sm" gap="lg" wrap="wrap">
      <Flex gap="xs" align="center">
        <Text fw={500}>Resolved</Text>
        <Select
          w={180}
          value={value.resolved || 'recently'}
          data={[
            { value: 'all', label: 'All' },
            { value: 'recently', label: 'Recently' },
            { value: 'none', label: 'None' },
          ]}
          onChange={(newValue) => {
            if (!newValue) {
              return
            }
            const newResolved = newValue as 'all' | 'recently' | 'none'
            onChange?.({ ...value, resolved: newResolved })
          }}
        />
      </Flex>
      <Flex gap="xs" align="center">
        <Text fw={500}>Read</Text>
        <Select
          w={180}
          value={value.read || 'all'}
          data={[
            { value: 'all', label: 'All' },
            { value: 'read', label: 'Read' },
            { value: 'unread', label: 'None' },
          ]}
          onChange={(newValue) => {
            if (!newValue) {
              return
            }
            const newRead = newValue as 'all' | 'read' | 'unread'
            onChange?.({ ...value, read: newRead })
          }}
        />
      </Flex>
    </Flex>
  )
}
