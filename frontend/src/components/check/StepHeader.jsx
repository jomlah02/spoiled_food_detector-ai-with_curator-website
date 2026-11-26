import { Box, Heading, Text } from '@chakra-ui/react'

function StepHeader({ title, subtitle }) {
  return (
    <Box mb={5}>
      <Heading as="h1" fontSize={{ base: '2xl', sm: '3xl' }} fontWeight="extrabold" lineHeight="1.2">
        {title}
      </Heading>
      {subtitle && (
        <Text color="fg.muted" mt={2}>
          {subtitle}
        </Text>
      )}
    </Box>
  )
}

export default StepHeader
