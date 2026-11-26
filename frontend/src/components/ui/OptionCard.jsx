import { Box, Flex, Text } from '@chakra-ui/react'
import { Check } from 'lucide-react'

// Pilihan besar yang mudah diketuk: ikon, judul, keterangan singkat.
function OptionCard({ icon: Icon, title, description, selected, onClick, tone = 'brand' }) {
  const toneBg = tone === 'brand' ? 'brand.subtle' : `status.${tone}.bg`
  const toneFg = tone === 'brand' ? 'brand.subtleFg' : `status.${tone}.fg`
  const toneBorder = tone === 'brand' ? 'brand' : `status.${tone}`

  return (
    <Flex
      as="button"
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      w="100%"
      align="center"
      gap={3}
      p={{ base: 3.5, sm: 4 }}
      textAlign="left"
      borderRadius="xl"
      border="1.5px solid"
      borderColor={selected ? toneBorder : 'border'}
      bg={selected ? toneBg : 'bg.surface'}
      transition="border-color 0.15s ease, background-color 0.15s ease, transform 0.1s ease"
      _hover={{ borderColor: selected ? toneBorder : 'border.strong' }}
      _active={{ transform: 'scale(0.99)' }}
      _focusVisible={{ outline: '2px solid', outlineColor: 'brand', outlineOffset: '2px' }}
    >
      {Icon && (
        <Flex
          w="40px"
          h="40px"
          flexShrink={0}
          align="center"
          justify="center"
          borderRadius="lg"
          bg={selected ? 'bg.surface' : 'bg.muted'}
          color={selected ? toneFg : 'fg.muted'}
        >
          <Icon size={20} aria-hidden="true" />
        </Flex>
      )}
      <Box flex="1" minW={0}>
        <Text fontWeight="semibold" color={selected ? toneFg : 'fg'} lineHeight="short">
          {title}
        </Text>
        {description && (
          <Text fontSize="sm" color="fg.muted" mt={0.5} lineHeight="short">
            {description}
          </Text>
        )}
      </Box>
      {selected && (
        <Box color={toneFg} flexShrink={0}>
          <Check size={18} strokeWidth={2.5} aria-hidden="true" />
        </Box>
      )}
    </Flex>
  )
}

export default OptionCard
