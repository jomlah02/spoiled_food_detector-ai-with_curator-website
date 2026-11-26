import { Box } from '@chakra-ui/react'

// Kartu dasar: permukaan putih dengan garis tipis.
function Panel({ children, ...rest }) {
  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border"
      borderRadius="2xl"
      p={{ base: 4, sm: 5 }}
      {...rest}
    >
      {children}
    </Box>
  )
}

export default Panel
