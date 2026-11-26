import { Box } from '@chakra-ui/react'

// Label kertas bergaris tinta. `tape` menambah selotip di atasnya.
function Label({ tape = false, tapeAt = '50%', tilt = 0, children, ...rest }) {
  return (
    <Box
      position="relative"
      bg="bg.surface"
      border="1.5px solid"
      borderColor="border"
      borderRadius="label"
      p={{ base: 4, sm: 5 }}
      transform={tilt ? `rotate(${tilt}deg)` : undefined}
      {...rest}
    >
      {tape && (
        <Box
          aria-hidden="true"
          position="absolute"
          top="-11px"
          left={tapeAt}
          w="88px"
          h="22px"
          bg="tape"
          opacity={0.9}
          transform="translateX(-50%) rotate(-2deg)"
        />
      )}
      {children}
    </Box>
  )
}

export default Label
