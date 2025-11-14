import { Flex, Input, Select } from '@mantine/core'
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
      <Input.Wrapper label="Resolved" w={180}>
        <Select
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
      </Input.Wrapper>
      <Input.Wrapper label="Read" w={180}>
        <Select
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
      </Input.Wrapper>
    </Flex>
  )
}
