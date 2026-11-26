import { Box, Flex, Text } from '@chakra-ui/react'
import { Check } from 'lucide-react'

function OptionCard({ title, description, selected, onClick, tone }) {
  const accent = tone ? `status.${tone}` : 'fg'

  return (
    <Flex
      as="button"
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      w="100%"
      align="start"
      gap={3}
      px={4}
      py={3.5}
      textAlign="left"
      bg={selected ? 'bg.surface' : 'transparent'}
      border="1.5px solid"
      borderColor={selected ? accent : 'border.soft'}
      borderRadius="label"
      transition="border-color 0.12s ease, background-color 0.12s ease"
      _hover={{ borderColor: selected ? accent : 'border', bg: 'bg.surface' }}
      _focusVisible={{ outline: '2px solid', outlineColor: 'fg', outlineOffset: '2px' }}
    >
      <Flex
        mt="2px"
        w="18px"
        h="18px"
        flexShrink={0}
        align="center"
        justify="center"
        border="1.5px solid"
        borderColor={selected ? accent : 'border'}
        bg={selected ? accent : 'transparent'}
        color="ink.fg"
        borderRadius="2px"
      >
        {selected && <Check size={13} strokeWidth={3} aria-hidden="true" />}
      </Flex>
      <Box flex="1" minW={0}>
        <Text fontWeight={600} lineHeight="short" color={selected && tone ? accent : 'fg'}>
          {title}
        </Text>
        {description && (
          <Text fontSize="sm" color="fg.muted" mt={0.5} lineHeight="short">
            {description}
          </Text>
        )}
      </Box>
    </Flex>
  )
}

export default OptionCard
