import { Box, Button, Flex, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { ArrowRight, ClipboardCheck, Clock, Plus, Refrigerator } from 'lucide-react'
import Panel from '../components/ui/Panel'
import StatusBadge from '../components/ui/StatusBadge'
import { useNow } from '../hooks/useNow'
import { getLiveStatus, sortByUrgency } from '../lib/itemStatus'
import { formatTimeLeft, startOfMonth } from '../lib/time'

const HOW_IT_WORKS = [
  { icon: ClipboardCheck, title: 'Jawab 4 pertanyaan', text: 'Makanannya apa, kapan dimasak, disimpan di mana, dan apa ada tanda aneh.' },
  { icon: Clock, title: 'Lihat hasil dan batas waktu', text: 'CuPI memberi tahu apa yang harus dilakukan dan sampai kapan.' },
  { icon: Refrigerator, title: 'Pantau di Kulkas saya', text: 'Tandai saat dimakan, dibagikan, atau dibuang.' },
]

function HomePage({ profile, kulkas, wizardInProgress, onNewCheck, onContinueCheck, onNavigate }) {
  const now = useNow()
  const firstVisit = kulkas.items.length === 0
  const upcoming = sortByUrgency(kulkas.active, now).slice(0, 3)

  const monthStart = startOfMonth(now)
  const closedThisMonth = kulkas.closed.filter((item) => item.closedAt >= monthStart)
  const saved = closedThisMonth.filter((item) => item.outcome !== 'tossed').length
  const tossed = closedThisMonth.length - saved

  return (
    <VStack align="stretch" spacing={7}>
      {/* Hero */}
      <Box pt={{ base: 2, md: 4 }}>
        <Text fontSize="sm" fontWeight="semibold" color="brand" mb={2}>
          {firstVisit ? 'Cek kelayakan makanan' : `Halo, ${profile.displayName}`}
        </Text>
        <Heading as="h1" fontSize={{ base: '3xl', sm: '4xl' }} fontWeight="extrabold" lineHeight="1.1">
          Masih aman dimakan?
        </Heading>
        <Text color="fg.muted" mt={3} fontSize={{ base: 'md', sm: 'lg' }} maxW="520px">
          Cek sisa makanan dalam ±30 detik. CuPI melihat kapan dimasak, di mana disimpan, dan tanda fisiknya.
        </Text>
        <Flex gap={3} mt={6} direction={{ base: 'column', sm: 'row' }}>
          <Button variant="primary" size="lg" leftIcon={<Plus size={20} />} onClick={onNewCheck}>
            Cek makanan
          </Button>
          {wizardInProgress && (
            <Button size="lg" rightIcon={<ArrowRight size={18} />} onClick={onContinueCheck}>
              Lanjutkan cek tadi
            </Button>
          )}
        </Flex>
      </Box>

      {/* Makanan yang masih ada */}
      {upcoming.length > 0 && (
        <Box>
          <Flex justify="space-between" align="baseline" mb={3}>
            <Heading as="h2" fontSize="lg" fontWeight="bold">
              Di kulkas kamu
            </Heading>
            <Button variant="ghost" size="sm" mr={-2} rightIcon={<ArrowRight size={15} />} onClick={() => onNavigate('kulkas')}>
              Lihat semua
            </Button>
          </Flex>
          <Panel p={0}>
            {upcoming.map((item, index) => {
              const live = getLiveStatus(item, now)
              return (
                <Flex
                  as="button"
                  type="button"
                  key={item.id}
                  onClick={() => onNavigate('kulkas')}
                  w="100%"
                  textAlign="left"
                  align="center"
                  gap={3}
                  px={4}
                  py={3}
                  borderTop={index === 0 ? 'none' : '1px solid'}
                  borderColor="border"
                  _hover={{ bg: 'bg.muted' }}
                >
                  <Box flex="1" minW={0}>
                    <Text fontWeight="semibold" noOfLines={1}>{item.foodName}</Text>
                    <Text fontSize="xs" color={live.expired ? 'status.danger' : 'fg.muted'}>
                      {item.deadline ? formatTimeLeft(item.deadline, now) : 'Tanpa batas waktu'}
                    </Text>
                  </Box>
                  <StatusBadge status={live.status} label={live.label} />
                </Flex>
              )
            })}
          </Panel>
        </Box>
      )}

      {/* Statistik bulan ini */}
      {closedThisMonth.length > 0 && (
        <SimpleGrid columns={2} spacing={3}>
          <Box p={4} borderRadius="xl" bg="brand.subtle">
            <Text fontSize="3xl" fontWeight="extrabold" fontFamily="heading" color="brand.subtleFg">
              {saved}
            </Text>
            <Text fontSize="sm" color="brand.subtleFg">porsi terselamatkan bulan ini</Text>
          </Box>
          <Box p={4} borderRadius="xl" bg="bg.muted">
            <Text fontSize="3xl" fontWeight="extrabold" fontFamily="heading">
              {tossed}
            </Text>
            <Text fontSize="sm" color="fg.muted">porsi dibuang bulan ini</Text>
          </Box>
        </SimpleGrid>
      )}

      {/* Cara kerja */}
      <Box>
        <Heading as="h2" fontSize="lg" fontWeight="bold" mb={3}>
          Cara kerjanya
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
          {HOW_IT_WORKS.map((step, index) => (
            <Panel key={step.title} p={4}>
              <HStack spacing={2} mb={2}>
                <Flex w="28px" h="28px" borderRadius="full" bg="brand.subtle" color="brand" align="center" justify="center" fontSize="sm" fontWeight="bold">
                  {index + 1}
                </Flex>
                <step.icon size={18} aria-hidden="true" />
              </HStack>
              <Text fontWeight="semibold">{step.title}</Text>
              <Text fontSize="sm" color="fg.muted" mt={1}>
                {step.text}
              </Text>
            </Panel>
          ))}
        </SimpleGrid>
      </Box>

      <Text fontSize="xs" color="fg.subtle" textAlign="center">
        CuPI memberi panduan umum berdasarkan waktu dan suhu simpan, bukan hasil uji laboratorium.
      </Text>
    </VStack>
  )
}

export default HomePage
