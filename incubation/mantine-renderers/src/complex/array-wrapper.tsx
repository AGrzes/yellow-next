import { Button, Group, Stack, Text } from '@mantine/core'
import { Plus } from 'lucide-react'

type ArrayWrapperProps = {
  label: string
  description?: string
  errors?: string
  enabled: boolean
  addLabel?: string
  addAriaLabel?: string
  onAdd: () => void
  children: React.ReactNode
}

export const ArrayControlWrapper = ({
  label,
  description,
  errors,
  enabled,
  addLabel,
  addAriaLabel,
  onAdd,
  children,
}: ArrayWrapperProps) => {
  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Text fw={600}>{label}</Text>
        <Button size="xs" onClick={onAdd} disabled={!enabled} aria-label={addAriaLabel} leftSection={<Plus size={14} />}>
          {addLabel}
        </Button>
      </Group>
      {description ? (
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      ) : null}
      {errors ? (
        <Text size="sm" c="red">
          {errors}
        </Text>
      ) : null}
      {children}
    </Stack>
  )
}
