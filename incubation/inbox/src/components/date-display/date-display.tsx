import { Flex, Text } from '@chakra-ui/react'

export function DateDisplay({ date, highlight }: { date: string; highlight: boolean }) {
  const formattedDate = new Date(date).toISOString()
  const datePart = formattedDate.split('T')[0]
  const timePart = formattedDate.split('T')[1].slice(0, 8)
  const fontWeight = highlight ? 'bold' : 'normal'

  return (
    <Flex direction={{ base: 'column', md: 'row' }} alignItems="center" marginRight="4">
      <Text fontSize="sm" color="gray.500" fontWeight={fontWeight}>
        {datePart}
      </Text>
      <Text
        fontSize={{ base: 'xs', md: 'sm' }}
        color={{ base: 'gray.500', md: 'gray.400' }}
        marginLeft={{ base: '0', md: '2' }}
        fontWeight={fontWeight}
      >
        {timePart}
      </Text>
    </Flex>
  )
}
