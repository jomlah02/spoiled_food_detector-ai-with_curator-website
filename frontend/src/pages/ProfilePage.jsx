import { useState } from 'react'
import { Box, Button, Flex, Heading, HStack, Input, Switch, Text, VStack, useColorMode } from '@chakra-ui/react'
import Label from '../components/ui/Label'

function SettingRow({ id, title, description, isChecked, onChange, first }) {
  return (
    <Flex
      as="label"
      htmlFor={id}
      align="center"
      justify="space-between"
      gap={4}
      py={4}
      cursor="pointer"
      borderTop={first ? 'none' : '1px dashed'}
      borderColor="border.soft"
    >
      <Box>
        <Text fontWeight={600}>{title}</Text>
        <Text fontSize="sm" color="fg.muted" mt={0.5}>
          {description}
        </Text>
      </Box>
      <Switch id={id} isChecked={isChecked} onChange={onChange} />
    </Flex>
  )
}

function ProfilePage({ profile, updateProfile, kulkas }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <VStack align="stretch" spacing={9}>
      <Heading as="h1" fontSize={{ base: '34px', sm: '42px' }} lineHeight="1.05">
        Profil
      </Heading>

      <Box>
        <Text as="label" htmlFor="display-name" textStyle="mono" color="fg.muted">
          Nama panggilan
        </Text>
        <Input
          id="display-name"
          size="lg"
          mt={2}
          value={profile.displayName}
          onChange={(e) => updateProfile('displayName', e.target.value)}
          onBlur={(e) => !e.target.value.trim() && updateProfile('displayName', 'Pengguna CuPI')}
        />
      </Box>

      <Box>
        <Text textStyle="mono" color="fg.muted" mb={1}>
          Pengaturan
        </Text>
        <SettingRow
          first
          id="dark-mode"
          title="Mode gelap"
          description="Lebih nyaman dipakai malam hari."
          isChecked={colorMode === 'dark'}
          onChange={toggleColorMode}
        />
        <SettingRow
          id="strict-room"
          title="Batas suhu ruang ketat"
          description="Pakai batas 2 jam untuk makanan di meja. Disarankan tetap nyala."
          isChecked={profile.strictRoomTempAlert}
          onChange={() => updateProfile('strictRoomTempAlert', !profile.strictRoomTempAlert)}
        />
        <SettingRow
          id="waste-tips"
          title="Tips biar tidak terbuang"
          description="Catatan kecil di hasil cek."
          isChecked={profile.showWasteGuidance}
          onChange={() => updateProfile('showWasteGuidance', !profile.showWasteGuidance)}
        />
      </Box>

      <Box>
        <Text textStyle="mono" color="fg.muted" mb={2}>
          Data
        </Text>
        <Text color="fg.muted">
          {kulkas.items.length} makanan tersimpan, hanya di browser ini. Tidak dikirim ke mana pun.
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
          kulkas.items.length > 0 && (
            <Button size="sm" mt={4} onClick={() => setConfirmReset(true)}>
              Hapus semua data
            </Button>
          )
        )}
      </Box>

      <Label tape tapeAt="20%" tilt={0.6}>
        <Text textStyle="mono" color="fg.muted" mb={2}>
          Tentang CuPI
        </Text>
        <Text fontFamily="heading" fontSize="lg" lineHeight="1.5">
          CuPI menilai makanan dari kapan dimasak dan di mana disimpan, ditambah bau dan tampilannya.
          Batas waktunya mengikuti &ldquo;aturan 2 jam&rdquo; dari pedoman keamanan pangan WHO dan USDA.
        </Text>
        <Text fontSize="sm" color="fg.muted" mt={3}>
          Ini panduan, bukan hasil lab. Kalau masih ragu, jangan dimakan.
        </Text>
      </Label>
    </VStack>
  )
}

export default ProfilePage
