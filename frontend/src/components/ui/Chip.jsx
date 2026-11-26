import { Box, Text } from '@chakra-ui/react'

// Tag kecil seperti potongan label. Terpilih = tinta penuh.
function Chip({ children, sub, selected, onClick, ...rest }) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      px={3}
      py={sub ? 2.5 : 1.5}
      borderRadius="2px"
      border="1.5px solid"
      borderColor={selected ? 'fg' : 'border.soft'}
      bg={selected ? 'fg' : 'bg.surface'}
      color={selected ? 'ink.fg' : 'fg'}
      textAlign="left"
      transition="border-color 0.12s ease, background-color 0.12s ease"
      _hover={{ borderColor: 'fg' }}
      _active={{ transform: 'translateY(1px)' }}
      _focusVisible={{ outline: '2px solid', outlineColor: 'fg', outlineOffset: '2px' }}
      {...rest}
    >
      <Text as="span" display="block" fontSize="sm" fontWeight={600}>
        {children}
      </Text>
      {sub && (
        <Text
          as="span"
          display="block"
          fontFamily="mono"
          fontSize="11px"
          mt={0.5}
          color={selected ? 'ink.fg' : 'fg.muted'}
          opacity={selected ? 0.8 : 1}
        >
          {sub}
        </Text>
      )}
    </Box>
  )
}

export default Chip
