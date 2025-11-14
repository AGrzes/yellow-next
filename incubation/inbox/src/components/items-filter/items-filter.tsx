import { Field, Flex, NativeSelect } from '@chakra-ui/react'
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
    <Flex padding="2" direction="row" gap="4">
      <Field.Root orientation="horizontal" w="192px">
        <Field.Label>Resolved</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field
            value={value.resolved || 'recently'}
            onChange={(e) => {
              const newResolved = e.target.value as 'all' | 'recently' | 'none'
              onChange?.({ ...value, resolved: newResolved })
            }}
          >
            <option value="all">All</option>
            <option value="recently">Recently</option>
            <option value="none">None</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>
      <Field.Root orientation="horizontal" w="192px">
        <Field.Label>Read</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field
            value={value.read || 'all'}
            onChange={(e) => {
              const newResolved = e.target.value as 'all' | 'read' | 'unread'
              onChange?.({ ...value, read: newResolved })
            }}
          >
            <option value="all">All</option>
            <option value="read">Read</option>
            <option value="unread">None</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>
    </Flex>
  )
}
