import { ActionIcon, Button } from '@mantine/core'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'

type ArrayActionButtonProps = {
  disabled: boolean
  ariaLabel?: string
  onClick: () => void
}

type ArrayAddButtonProps = {
  label?: string
  ariaLabel?: string
  disabled: boolean
  onClick: () => void
}

export const ArrayAddButton = ({ label, ariaLabel, disabled, onClick }: ArrayAddButtonProps) => {
  return (
    <Button
      size="xs"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      disabled={disabled}
      aria-label={ariaLabel}
      leftSection={<Plus size={14} />}
    >
      {label}
    </Button>
  )
}

export const ArrayMoveUpButton = ({ disabled, ariaLabel, onClick }: ArrayActionButtonProps) => {
  return (
    <ActionIcon
      size="sm"
      variant="subtle"
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      <ChevronUp size={14} />
    </ActionIcon>
  )
}

export const ArrayMoveDownButton = ({ disabled, ariaLabel, onClick }: ArrayActionButtonProps) => {
  return (
    <ActionIcon
      size="sm"
      variant="subtle"
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      <ChevronDown size={14} />
    </ActionIcon>
  )
}

export const ArrayRemoveButton = ({ disabled, ariaLabel, onClick }: ArrayActionButtonProps) => {
  return (
    <ActionIcon
      size="sm"
      variant="subtle"
      color="red"
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      <Trash2 size={14} />
    </ActionIcon>
  )
}
