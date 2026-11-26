import { useState } from 'react'
import { Box, Button, Flex, Heading, HStack, Input, Switch, Text, VStack, useColorMode } from '@chakra-ui/react'
import Panel from '../components/ui/Panel'

function SettingRow({ id, title, description, isChecked, onChange }) {
  return (
    <Flex as="label" htmlFor={id} align="center" justify="space-between" gap={4} py={3.5} cursor="pointer">
      <Box>
        <Text fontWeight="semibold">{title}</Text>
        <Text fontSize="sm" color="fg.muted" mt={0.5}>
          {description}
        </Text>
      </Box>
      <Switch id={id} size="lg" isChecked={isChecked} onChange={onChange} />
    </Flex>
  )
}

function ProfilePage({ profile, updateProfile, kulkas }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const [confirmReset, setConfirmReset] = useState(false)
  const initials = (profile.displayName || 'CuPI')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <VStack align="stretch" spacing={5}>
      <Heading as="h1" fontSize={{ base: '2xl', sm: '3xl' }} fontWeight="extrabold">
        Profil
      </Heading>

      <Panel>
        <HStack spacing={4}>
          <Flex w="52px" h="52px" flexShrink={0} borderRadius="full" bg="brand" color="brand.fg" align="center" justify="center" fontWeight="bold" fontSize="lg">
            {initials}
          </Flex>
          <Box flex="1">
            <Text as="label" htmlFor="display-name" fontSize="sm" color="fg.muted">
              Nama panggilan
            </Text>
            <Input
              id="display-name"
              value={profile.displayName}
              onChange={(e) => updateProfile('displayName', e.target.value)}
              onBlur={(e) => !e.target.value.trim() && updateProfile('displayName', 'Pengguna CuPI')}
              mt={1}
            />
          </Box>
        </HStack>
      </Panel>

      <Panel py={1}>
        <SettingRow
          id="dark-mode"
          title="Mode gelap"
          description="Tampilan gelap untuk malam hari."
          isChecked={colorMode === 'dark'}
          onChange={toggleColorMode}
        />
        <Box borderTop="1px solid" borderColor="border" />
        <SettingRow
          id="strict-room"
          title="Batas suhu ruang ketat"
          description="Pakai batas 2 jam untuk makanan di suhu ruang (disarankan)."
          isChecked={profile.strictRoomTempAlert}
          onChange={() => updateProfile('strictRoomTempAlert', !profile.strictRoomTempAlert)}
        />
        <Box borderTop="1px solid" borderColor="border" />
        <SettingRow
          id="waste-tips"
          title="Tips kurangi food waste"
          description="Tampilkan saran agar makanan tidak terbuang."
          isChecked={profile.showWasteGuidance}
          onChange={() => updateProfile('showWasteGuidance', !profile.showWasteGuidance)}
        />
      </Panel>

      <Panel>
        <Text fontWeight="semibold">Data di perangkat ini</Text>
        <Text fontSize="sm" color="fg.muted" mt={1}>
          {kulkas.items.length} makanan tersimpan. Semua data hanya ada di browser ini.
        </Text>
        {confirmReset ? (
          <HStack mt={4} spacing={3}>
            <Button variant="danger" size="sm" onClick={() => { kulkas.clearAll(); setConfirmReset(false) }}>
              Ya, hapus semua
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
              Batal
            </Button>
          </HStack>
        ) : (
          <Button size="sm" mt={4} onClick={() => setConfirmReset(true)} isDisabled={kulkas.items.length === 0}>
            Hapus semua data
          </Button>
        )}
      </Panel>

      <Panel bg="bg.muted" borderColor="transparent">
        <Text fontWeight="semibold">Tentang CuPI</Text>
        <Text fontSize="sm" color="fg.muted" mt={1}>
          CuPI menilai kelayakan makanan dari waktu dan suhu penyimpanan, ditambah pengamatan bau dan
          tampilan. Batas waktunya mengacu pada prinsip umum keamanan pangan seperti &quot;aturan 2 jam&quot;
          (WHO Five Keys to Safer Food dan USDA). Ini panduan, bukan hasil uji laboratorium. Kalau ragu,
          lebih baik jangan dimakan.
        </Text>
      </Panel>
    </VStack>
  )
}

export default ProfilePage
