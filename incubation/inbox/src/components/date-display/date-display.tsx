import { Flex, Text } from '@mantine/core'

export function DateDisplay({ date, highlight }: { date: string; highlight: boolean }) {
  const formattedDate = new Date(date).toISOString()
  const datePart = formattedDate.split('T')[0]
  const timePart = formattedDate.split('T')[1].slice(0, 8)
  const fontWeight = highlight ? 'bold' : 'normal'

  return (
    <Flex direction="row" align="center" gap="xs" wrap="wrap" mr="md">
      <Text size="sm" c="gray" fw={fontWeight}>
        {datePart}
      </Text>
      <Text size="xs" c="dimmed" fw={fontWeight}>
        {timePart}
      </Text>
    </Flex>
  )
}
