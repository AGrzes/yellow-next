import { Badge } from '@mantine/core'

export function LabelDisplay({ labelKey, labelValue }: { labelKey: string; labelValue: string }) {
  return (
    <Badge variant="light" color="blue">
      {labelKey}: {labelValue}
    </Badge>
  )
}
