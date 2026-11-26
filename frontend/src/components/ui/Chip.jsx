import { Box, Text } from '@chakra-ui/react'

// Tombol kecil berbentuk pil, untuk pilihan cepat.
function Chip({ children, sub, selected, onClick, ...rest }) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      px={3.5}
      py={sub ? 2 : 1.5}
      borderRadius={sub ? 'xl' : 'full'}
      border="1.5px solid"
      borderColor={selected ? 'brand' : 'border'}
      bg={selected ? 'brand.subtle' : 'bg.surface'}
      color={selected ? 'brand.subtleFg' : 'fg'}
      textAlign="left"
      transition="border-color 0.15s ease, background-color 0.15s ease"
      _hover={{ borderColor: selected ? 'brand' : 'border.strong' }}
      _active={{ transform: 'scale(0.98)' }}
      _focusVisible={{ outline: '2px solid', outlineColor: 'brand', outlineOffset: '2px' }}
      {...rest}
    >
      <Text as="span" display="block" fontSize="sm" fontWeight="semibold">
        {children}
      </Text>
      {sub && (
        <Text as="span" display="block" fontSize="xs" color="fg.muted" mt={0.5}>
          {sub}
        </Text>
      )}
    </Box>
  )
}

export default Chip
