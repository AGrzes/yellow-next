import { Box, Button, ButtonGroup, Flex, Text, Wrap } from '@chakra-ui/react'
import type { Content, Item } from '@model/item.ts'

function ContentDisplay({ content, ...boxProps }: { content: Content } & BoxProps) {
  if ('html' in content) {
    return <Box {...boxProps} dangerouslySetInnerHTML={{ __html: content.html }} />
  }
  return (
    <Box as="pre" {...boxProps}>
      {content.markdown}
    </Box>
  )
}

export function ItemLine({ item }: { item: Item }) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      padding="4"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex direction="column" flex="1">
        <Flex alignItems="center" gap="2">
          <Text fontSize="lg" fontWeight={item.read ? 'normal' : 'bold'}>
            {item.title}
          </Text>
          {item.labels && (
            <Wrap>
              {Object.entries(item.labels).map(([key, value]) => (
                <Box
                  key={key}
                  as="span"
                  backgroundColor="blue.100"
                  color="blue.800"
                  paddingX="2"
                  paddingY="1"
                  borderRadius="md"
                  fontSize="sm"
                >
                  {key}: {value}
                </Box>
              ))}
            </Wrap>
          )}
        </Flex>
        {item.summary && <ContentDisplay content={item.summary} fontSize="sm" color="gray.500" />}
      </Flex>
      <ButtonGroup gap="2" position="absolute" right="4" top="50%" transform="translateY(-50%)">
        <Button variant="outline" colorScheme="green">
          Resolve
        </Button>
        <Button variant="outline">More</Button>
      </ButtonGroup>
    </Box>
  )
}
