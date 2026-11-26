import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import { useCupiTokens } from '../../theme/useCupiTokens'

function Footer() {
  const {
    surfaceSage,
    freshGreen,
    textMain,
    textMuted,
    borderSubtle,
  } = useCupiTokens()

  return (
    <Box
      as="footer"
      w="100%"
      bg={surfaceSage}
      borderTop="1px solid"
      borderColor={borderSubtle}
      py={4}
      px={6}
    >
      <Flex
        maxW="880px"
        mx="auto"
        direction={{ base: 'column', sm: 'row' }}
        align="center"
        justify="space-between"
        gap={2}
        fontSize="xs"
        color={textMuted}
      >
        <HStack spacing={2}>
          <Box w="6px" h="6px" borderRadius="full" bg={freshGreen} />
          <Text fontFamily="'Figtree', sans-serif" fontWeight="bold" color={textMain}>
            CuPI
          </Text>
          <Text>• Food Condition & Safety Assistant</Text>
        </HStack>

        <Text textAlign="center">
          Riwayat waktu & suhu penyimpanan adalah penentu utama keamanan pangan
        </Text>
      </Flex>
    </Box>
  )
}

export default Footer
