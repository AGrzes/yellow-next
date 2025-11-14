import { Flex, Input, Select } from '@mantine/core'

const horizontalInputStyles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--mantine-spacing-xs)',
  },
  label: {
    marginBottom: 0,
  },
  input: {
    flex: 1,
  },
}
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
      <Input.Wrapper label="Resolved" labelProps={{ style: { fontWeight: 500 } }} styles={horizontalInputStyles}>
        <Select
          w={128}
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
      <Input.Wrapper label="Read" labelProps={{ style: { fontWeight: 500 } }} styles={horizontalInputStyles}>
        <Select
          w={128}
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
