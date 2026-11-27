import { Box, Heading, Text } from '@chakra-ui/react'

function StepHeader({ title, subtitle }) {
  return (
    <Box mb={6}>
      <Heading as="h1" fontSize={{ base: '30px', sm: '38px' }} lineHeight="1.08">
        {title}
      </Heading>
      {subtitle && (
        <Text color="fg.muted" mt={3} fontSize="md">
          {subtitle}
        </Text>
      )}
    </Box>
  )
}

export default StepHeader
