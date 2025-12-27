import { Group, Stack, Text } from '@mantine/core'
import { ArrayAddButton } from './array-action-buttons'

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
        <ArrayAddButton label={addLabel} ariaLabel={addAriaLabel} disabled={!enabled} onClick={onAdd} />
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
