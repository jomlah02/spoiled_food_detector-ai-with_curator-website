import { Box } from '@chakra-ui/react'

function TextButton({ children, ...props }) {
  return (
    <Box as="button" type="button" textStyle="mono" color="fg.muted" _hover={{ color: 'fg' }} {...props}>
      {children}
    </Box>
  )
}

export default TextButton
