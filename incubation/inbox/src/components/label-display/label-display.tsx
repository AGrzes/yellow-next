import { Tag } from '@chakra-ui/react'

export function LabelDisplay({ labelKey, labelValue }: { labelKey: string; labelValue: string }) {
  return (
    <Tag.Root colorPalette={'blue'}>
      <Tag.Label>
        {labelKey}: {labelValue}
      </Tag.Label>
    </Tag.Root>
  )
}
