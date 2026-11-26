import { useState } from 'react'
import { Box, Collapse, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import { Check, ChevronDown, Leaf } from 'lucide-react'

// Bagian bersama hasil cek: langkah yang harus dilakukan, tips food waste, dan "kenapa".
export function ActionList({ actions }) {
  return (
    <VStack as="ul" listStyleType="none" align="stretch" spacing={2.5}>
      {actions.map((action) => (
        <HStack as="li" key={action} align="start" spacing={2.5}>
          <Flex
            mt="1px"
            w="20px"
            h="20px"
            flexShrink={0}
            borderRadius="full"
            bg="bg.muted"
            color="fg.muted"
            align="center"
            justify="center"
          >
            <Check size={12} strokeWidth={3} aria-hidden="true" />
          </Flex>
          <Text>{action}</Text>
        </HStack>
      ))}
    </VStack>
  )
}

export function WasteTip({ children }) {
  return (
    <HStack align="start" spacing={3} p={4} borderRadius="xl" bg="brand.subtle" color="brand.subtleFg">
      <Box mt="2px" flexShrink={0}>
        <Leaf size={18} aria-hidden="true" />
      </Box>
      <Text fontSize="sm">{children}</Text>
    </HStack>
  )
}

export function WhyDetails({ record, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <Box>
      <HStack
        as="button"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        spacing={1.5}
        color="fg.muted"
        fontWeight="semibold"
        fontSize="sm"
        _hover={{ color: 'fg' }}
      >
        <Text>Kenapa hasilnya begini?</Text>
        <Box transform={open ? 'rotate(180deg)' : 'none'} transition="transform 0.2s ease">
          <ChevronDown size={16} aria-hidden="true" />
        </Box>
      </HStack>
      <Collapse in={open} animateOpacity>
        <VStack align="stretch" spacing={3} mt={3} fontSize="sm" color="fg.muted">
          {record.factors?.time && (
            <Box>
              <Text fontWeight="semibold" color="fg">Waktu dan penyimpanan</Text>
              <Text>{record.factors.time}</Text>
            </Box>
          )}
          {record.factors?.sensory && (
            <Box>
              <Text fontWeight="semibold" color="fg">Bau dan tampilan</Text>
              <Text>{record.factors.sensory}</Text>
            </Box>
          )}
          <Box>
            <Text fontWeight="semibold" color="fg">Alasannya</Text>
            <Text>{record.reasoning}</Text>
          </Box>
          <Text fontSize="xs" color="fg.subtle">
            CuPI memberi panduan umum, bukan hasil uji laboratorium. Kalau ragu, lebih baik jangan dimakan.
          </Text>
        </VStack>
      </Collapse>
    </Box>
  )
}
