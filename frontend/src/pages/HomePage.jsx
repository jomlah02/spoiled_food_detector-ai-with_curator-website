import { Box, Button, Flex, Heading, Stack, Text, VStack } from '@chakra-ui/react'
import Label from '../components/ui/Label'
import LabelRows from '../components/ui/LabelRows'
import Stamp from '../components/ui/Stamp'
import TextButton from '../components/ui/TextButton'
import { useNow } from '../hooks/useNow'
import { getLiveStatus, sortByUrgency } from '../lib/itemStatus'
import { formatTimeLeft, startOfMonth } from '../lib/time'

function SampleLabel() {
  return (
    <Box position="relative" maxW="360px" mx={{ base: 'auto', md: 0 }}>
      <Label tape tapeAt="62%" tilt={-2} p={5}>
        <Flex justify="space-between" align="start">
          <Text textStyle="mono" color="fg.muted">Nasi goreng</Text>
          <Text fontFamily="mono" fontSize="10px" color="fg.subtle">CONTOH</Text>
        </Flex>
        <Heading as="p" fontSize="24px" lineHeight="1.1" mt={2}>
          Segera makan atau masukkan kulkas
        </Heading>
        <Box mt={4}>
          <Stamp status="caution" />
        </Box>
        <Box mt={4} pt={3} borderTop="1.5px dashed" borderColor="border.soft">
          <LabelRows
            rows={[
              ['Masak', 'tadi pagi 07.00'],
              ['Simpan', 'di meja, tertutup'],
              ['Batas', 'hari ini 09.00'],
            ]}
          />
        </Box>
      </Label>
    </Box>
  )
}

function ReceiptLine({ label, value }) {
  return (
    <Flex align="baseline" gap={2} fontFamily="mono" fontSize="13px">
      <Text textTransform="uppercase" letterSpacing="0.06em">{label}</Text>
      <Box flex="1" borderBottom="1.5px dotted" borderColor="border.soft" transform="translateY(-4px)" />
      <Text fontWeight={600}>{String(value).padStart(2, '0')}</Text>
    </Flex>
  )
}

function HomePage({ profile, kulkas, wizardInProgress, onNewCheck, onContinueCheck, onNavigate }) {
  const now = useNow()
  const upcoming = sortByUrgency(kulkas.active, now).slice(0, 3)

  const monthStart = startOfMonth(now)
  const closedThisMonth = kulkas.closed.filter((item) => item.closedAt >= monthStart)
  const saved = closedThisMonth.filter((item) => item.outcome !== 'tossed').length
  const tossed = closedThisMonth.length - saved
  const isNewHere = kulkas.items.length === 0

  return (
    <VStack align="stretch" spacing={12}>
      <Box>
        {!isNewHere && (
          <Text textStyle="mono" color="fg.muted" mb={4}>
            Halo, {profile.displayName}
          </Text>
        )}
        <Heading as="h1" fontSize={{ base: '44px', sm: '60px' }} lineHeight="0.98" letterSpacing="-0.035em">
          Masih aman
          <br />
          dimakan?
        </Heading>
        <Text color="fg.muted" mt={5} fontSize={{ base: 'md', sm: 'lg' }} maxW="440px">
          Jawab empat pertanyaan singkat. Kamu dapat label: boleh dimakan atau tidak, dan sampai kapan.
        </Text>
        <Stack direction={{ base: 'column', sm: 'row' }} spacing={2} mt={7}>
          <Button variant="primary" size="lg" onClick={onNewCheck}>
            Cek makanan →
          </Button>
          {wizardInProgress && (
            <Button size="lg" onClick={onContinueCheck}>
              Lanjutkan yang tadi
            </Button>
          )}
        </Stack>
      </Box>

      {upcoming.length === 0 ? (
        <Box pt={2}>
          <SampleLabel />
        </Box>
      ) : (
        <Box>
          <Flex justify="space-between" align="baseline" mb={4}>
            <Text textStyle="mono" color="fg.muted">Di kulkas kamu</Text>
            <TextButton fontSize="11px" onClick={() => onNavigate('kulkas')}>
              Lihat semua →
            </TextButton>
          </Flex>
          <Label p={0}>
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
                  py={3.5}
                  borderTop={index === 0 ? 'none' : '1px dashed'}
                  borderColor="border.soft"
                  _hover={{ bg: 'bg.muted' }}
                >
                  <Box flex="1" minW={0}>
                    <Text fontWeight={600} noOfLines={1}>{item.foodName}</Text>
                    <Text fontFamily="mono" fontSize="11px" color={live.expired ? 'status.danger' : 'fg.subtle'} textTransform="uppercase">
                      {item.deadline ? formatTimeLeft(item.deadline, now) : 'tanpa batas waktu'}
                    </Text>
                  </Box>
                  <Stamp status={live.status} label={live.label} />
                </Flex>
              )
            })}
          </Label>
        </Box>
      )}

      {closedThisMonth.length > 0 && (
        <Box maxW="360px" p={5} bg="bg.surface" border="1.5px dashed" borderColor="border" borderRadius="label">
          <Text textStyle="mono" color="fg.muted" mb={3}>Bulan ini</Text>
          <VStack align="stretch" spacing={2}>
            <ReceiptLine label="Diselamatkan" value={saved} />
            <ReceiptLine label="Dibuang" value={tossed} />
          </VStack>
        </Box>
      )}

      <Text fontSize="xs" color="fg.subtle" maxW="440px">
        CuPI memberi panduan umum dari waktu dan tempat simpan, bukan hasil uji lab. Kalau masih ragu, jangan dimakan.
      </Text>
    </VStack>
  )
}

export default HomePage
