import { useState } from 'react'
import { Box, Collapse, HStack, Text, VStack } from '@chakra-ui/react'

export function ActionList({ actions }) {
  return (
    <VStack as="ol" listStyleType="none" align="stretch" spacing={0}>
      {actions.map((action, index) => (
        <HStack
          as="li"
          key={action}
          align="baseline"
          spacing={4}
          py={3}
          borderTop={index === 0 ? 'none' : '1px dashed'}
          borderColor="border.soft"
        >
          <Text fontFamily="mono" fontSize="sm" color="fg.subtle" flexShrink={0}>
            {String(index + 1).padStart(2, '0')}
          </Text>
          <Text>{action}</Text>
        </HStack>
      ))}
    </VStack>
  )
}

export function WasteTip({ children }) {
  return (
    <Box borderLeft="3px solid" borderColor="brand" borderRadius={0} pl={4} py={1}>
      <Text textStyle="mono" fontSize="10px" color="brand" mb={1}>
        Biar tidak terbuang
      </Text>
      <Text fontFamily="heading" fontStyle="italic" fontSize="md" color="fg.muted" lineHeight="1.5">
        {children}
      </Text>
    </Box>
  )
}

export function WhyDetails({ record }) {
  const [open, setOpen] = useState(false)
  return (
    <Box>
      <Box
        as="button"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        textStyle="mono"
        color="fg.muted"
        _hover={{ color: 'fg' }}
      >
        {open ? '− Tutup penjelasan' : '+ Kenapa begini?'}
      </Box>
      <Collapse in={open} animateOpacity>
        <VStack align="stretch" spacing={3} mt={3} fontSize="sm" color="fg.muted">
          {record.factors?.time && (
            <Box>
              <Text fontWeight={600} color="fg">Waktu dan tempat simpan</Text>
              <Text>{record.factors.time}</Text>
            </Box>
          )}
          {record.factors?.sensory && (
            <Box>
              <Text fontWeight={600} color="fg">Bau dan tampilan</Text>
              <Text>{record.factors.sensory}</Text>
            </Box>
          )}
          <Box>
            <Text fontWeight={600} color="fg">Alasannya</Text>
            <Text>{record.reasoning}</Text>
          </Box>
          <Text fontSize="xs" color="fg.subtle">
            Ini panduan umum, bukan hasil lab. Kalau masih ragu, jangan dimakan.
          </Text>
        </VStack>
      </Collapse>
    </Box>
  )
}
