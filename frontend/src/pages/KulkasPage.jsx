import { useState } from 'react'
import { Box, Button, Flex, Heading, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import { HandHeart, Plus, Refrigerator, Trash2, Undo2, Utensils } from 'lucide-react'
import KulkasItemCard from '../components/kulkas/KulkasItemCard'
import Panel from '../components/ui/Panel'
import { OUTCOMES } from '../constants/status'
import { useNow } from '../hooks/useNow'
import { sortByUrgency } from '../lib/itemStatus'
import { formatMoment } from '../lib/time'

const OUTCOME_ICONS = { eaten: Utensils, shared: HandHeart, tossed: Trash2 }

function TabButton({ active, onClick, children }) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      aria-pressed={active}
      flex="1"
      py={2}
      borderRadius="lg"
      fontSize="sm"
      fontWeight="semibold"
      bg={active ? 'bg.surface' : 'transparent'}
      color={active ? 'fg' : 'fg.muted'}
      boxShadow={active ? 'sm' : 'none'}
    >
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
    <VStack align="stretch" spacing={5}>
      <Box>
        <Heading as="h1" fontSize={{ base: '2xl', sm: '3xl' }} fontWeight="extrabold">
          Kulkas saya
        </Heading>
        <Text color="fg.muted" mt={1}>
          Makanan yang sudah kamu cek. Tandai kalau sudah dimakan, dibagikan, atau dibuang.
        </Text>
      </Box>

      <HStack p={1} borderRadius="xl" bg="bg.muted" spacing={1}>
        <TabButton active={tab === 'active'} onClick={() => setTab('active')}>
          Masih ada ({kulkas.active.length})
        </TabButton>
        <TabButton active={tab === 'closed'} onClick={() => setTab('closed')}>
          Selesai ({kulkas.closed.length})
        </TabButton>
      </HStack>

      {tab === 'active' &&
        (active.length === 0 ? (
          <Panel textAlign="center" py={10}>
            <Flex w="56px" h="56px" mx="auto" borderRadius="full" bg="brand.subtle" color="brand" align="center" justify="center">
              <Refrigerator size={26} aria-hidden="true" />
            </Flex>
            <Text fontWeight="bold" mt={4}>
              Cek makanan pertamamu
            </Text>
            <Text color="fg.muted" fontSize="sm" mt={1} maxW="320px" mx="auto">
              Setiap hasil cek tersimpan di sini lengkap dengan sisa waktunya.
            </Text>
            <Button variant="primary" mt={5} leftIcon={<Plus size={18} />} onClick={onNewCheck}>
              Cek makanan
            </Button>
          </Panel>
        ) : (
          <VStack align="stretch" spacing={3}>
            {active.map((item) => (
              <KulkasItemCard
                key={item.id}
                item={item}
                now={now}
                onOutcome={kulkas.setOutcome}
                onRecheck={onRecheck}
                onDelete={kulkas.deleteItem}
              />
            ))}
          </VStack>
        ))}

      {tab === 'closed' &&
        (kulkas.closed.length === 0 ? (
          <Panel textAlign="center" py={8}>
            <Text color="fg.muted" fontSize="sm">
              Makanan yang sudah dimakan, dibagikan, atau dibuang akan muncul di sini.
            </Text>
          </Panel>
        ) : (
          <>
            <Panel p={0}>
              {kulkas.closed.map((item, index) => {
                const Icon = OUTCOME_ICONS[item.outcome]
                return (
                  <HStack
                    key={item.id}
                    px={4}
                    py={3}
                    spacing={3}
                    borderTop={index === 0 ? 'none' : '1px solid'}
                    borderColor="border"
                  >
                    <Flex
                      w="36px"
                      h="36px"
                      flexShrink={0}
                      borderRadius="full"
                      align="center"
                      justify="center"
                      bg={item.outcome === 'tossed' ? 'bg.muted' : 'brand.subtle'}
                      color={item.outcome === 'tossed' ? 'fg.muted' : 'brand'}
                    >
                      <Icon size={17} aria-hidden="true" />
                    </Flex>
                    <Box flex="1" minW={0}>
                      <Text fontWeight="semibold" noOfLines={1}>
                        {item.foodName}
                      </Text>
                      <Text fontSize="xs" color="fg.muted">
                        {OUTCOMES[item.outcome]} · {formatMoment(item.closedAt, now)}
                      </Text>
                    </Box>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      aria-label={`Kembalikan ${item.foodName} ke daftar`}
                      icon={<Undo2 size={16} />}
                      onClick={() => kulkas.setOutcome(item.id, null)}
                    />
                    <IconButton
                      variant="ghost"
                      size="sm"
                      aria-label={`Hapus ${item.foodName}`}
                      icon={<Trash2 size={16} />}
                      onClick={() => kulkas.deleteItem(item.id)}
                    />
                  </HStack>
                )
              })}
            </Panel>
            {confirmClear ? (
              <HStack justify="center" spacing={3}>
                <Text fontSize="sm" color="fg.muted">Hapus semua yang selesai?</Text>
                <Button size="sm" variant="danger" onClick={() => { kulkas.clearClosed(); setConfirmClear(false) }}>
                  Hapus
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmClear(false)}>
                  Batal
                </Button>
              </HStack>
            ) : (
              <Button variant="ghost" size="sm" alignSelf="center" onClick={() => setConfirmClear(true)}>
                Hapus semua yang selesai
              </Button>
            )}
          </>
        ))}
    </VStack>
  )
}

export default KulkasPage
