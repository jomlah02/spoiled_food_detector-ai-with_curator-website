import { useState } from 'react'
import { Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import KulkasItemCard from '../components/kulkas/KulkasItemCard'
import { OUTCOMES } from '../constants/status'
import { useNow } from '../hooks/useNow'
import { sortByUrgency } from '../lib/itemStatus'
import { formatMoment } from '../lib/time'

// Posisi label sedikit berbeda-beda, seperti ditempel tangan.
const TILTS = [-0.6, 0.5, -0.3, 0.7, -0.5]
const TAPES = ['50%', '30%', '68%', '42%', '60%']

function Tab({ active, onClick, children }) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      aria-pressed={active}
      textStyle="mono"
      pb={2}
      color={active ? 'fg' : 'fg.subtle'}
      borderBottom="2px solid"
      borderColor={active ? 'fg' : 'transparent'}
      _hover={{ color: 'fg' }}
    >
      {children}
    </Box>
  )
}

function SmallTextButton({ onClick, children, ...rest }) {
  return (
    <Box as="button" type="button" onClick={onClick} textStyle="mono" fontSize="10px" color="fg.muted" _hover={{ color: 'fg' }} {...rest}>
      {children}
    </Box>
  )
}

function KulkasPage({ kulkas, onNewCheck, onRecheck }) {
  const now = useNow()
  const [tab, setTab] = useState('active')
  const [confirmClear, setConfirmClear] = useState(false)
  const active = sortByUrgency(kulkas.active, now)

  return (
    <VStack align="stretch" spacing={7}>
      <Box>
        <Heading as="h1" fontSize={{ base: '34px', sm: '42px' }} lineHeight="1.05">
          Kulkas saya
        </Heading>
        <Text color="fg.muted" mt={2}>
          Semua yang sudah kamu cek. Yang paling mendesak ada di atas.
        </Text>
      </Box>

      <HStack spacing={6} borderBottom="1.5px solid" borderColor="border.soft">
        <Tab active={tab === 'active'} onClick={() => setTab('active')}>
          Masih ada ({kulkas.active.length})
        </Tab>
        <Tab active={tab === 'closed'} onClick={() => setTab('closed')}>
          Selesai ({kulkas.closed.length})
        </Tab>
      </HStack>

      {tab === 'active' &&
        (active.length === 0 ? (
          <Box py={10} px={6} textAlign="center" border="1.5px dashed" borderColor="border.soft" borderRadius="label">
            <Text fontFamily="heading" fontSize="2xl" fontWeight={600}>
              Masih kosong.
            </Text>
            <Text color="fg.muted" mt={2} maxW="320px" mx="auto">
              Setiap makanan yang kamu cek akan ditempel di sini, lengkap dengan sisa waktunya.
            </Text>
            <Button variant="primary" mt={6} onClick={onNewCheck}>
              Cek makanan
            </Button>
          </Box>
        ) : (
          <VStack align="stretch" spacing={7} pt={2}>
            {active.map((item, index) => (
              <KulkasItemCard
                key={item.id}
                item={item}
                now={now}
                tilt={TILTS[index % TILTS.length]}
                tapeAt={TAPES[index % TAPES.length]}
                onOutcome={kulkas.setOutcome}
                onRecheck={onRecheck}
                onDelete={kulkas.deleteItem}
              />
            ))}
          </VStack>
        ))}

      {tab === 'closed' &&
        (kulkas.closed.length === 0 ? (
          <Text color="fg.muted" py={6}>
            Yang sudah dimakan, dibagikan, atau dibuang akan dicatat di sini.
          </Text>
        ) : (
          <Box>
            {/* Seperti struk: satu baris per makanan */}
            <Box bg="bg.surface" border="1.5px solid" borderColor="border" borderRadius="label" px={4} py={2}>
              {kulkas.closed.map((item, index) => (
                <Flex
                  key={item.id}
                  align="baseline"
                  gap={3}
                  py={3}
                  borderTop={index === 0 ? 'none' : '1px dashed'}
                  borderColor="border.soft"
                >
                  <Box flex="1" minW={0}>
                    <Text
                      fontWeight={600}
                      noOfLines={1}
                      textDecoration={item.outcome === 'tossed' ? 'line-through' : 'none'}
                      color={item.outcome === 'tossed' ? 'fg.muted' : 'fg'}
                    >
                      {item.foodName}
                    </Text>
                    <Text fontFamily="mono" fontSize="11px" color="fg.subtle">
                      {formatMoment(item.closedAt, now)}
                    </Text>
                  </Box>
                  <Text textStyle="mono" fontSize="11px" color={item.outcome === 'tossed' ? 'fg.muted' : 'brand'}>
                    {OUTCOMES[item.outcome]}
                  </Text>
                  <SmallTextButton onClick={() => kulkas.setOutcome(item.id, null)} aria-label={`Kembalikan ${item.foodName}`}>
                    Batal
                  </SmallTextButton>
                  <SmallTextButton onClick={() => kulkas.deleteItem(item.id)} aria-label={`Hapus ${item.foodName}`}>
                    Hapus
                  </SmallTextButton>
                </Flex>
              ))}
            </Box>
            <Box mt={5} textAlign="center">
              {confirmClear ? (
                <HStack justify="center" spacing={4}>
                  <Text fontSize="sm" color="fg.muted">Hapus semua catatan ini?</Text>
                  <Button size="sm" variant="danger" onClick={() => { kulkas.clearClosed(); setConfirmClear(false) }}>
                    Hapus
                  </Button>
                  <SmallTextButton onClick={() => setConfirmClear(false)}>Batal</SmallTextButton>
                </HStack>
              ) : (
                <SmallTextButton onClick={() => setConfirmClear(true)}>Hapus semua catatan</SmallTextButton>
              )}
            </Box>
          </Box>
        ))}
    </VStack>
  )
}

export default KulkasPage
