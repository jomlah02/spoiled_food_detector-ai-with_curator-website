import { Box, Flex, HStack, VStack, SimpleGrid, Text, useColorMode } from '@chakra-ui/react'
import Card from '../components/Card'
import { useCupiTokens } from '../theme/useCupiTokens'

function ProfilePage({ profileState, history }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const {
    surfaceCream,
    surfaceInteractive,
    primaryGreen,
    primaryBtnBg,
    primaryBtnText,
    textMain,
    textMuted,
    borderSubtle,
    borderStrong,
    inputBg,
    redStatus,
  } = useCupiTokens()
  const {
    profile,
    isEditingProfile,
    setIsEditingProfile,
    profileDraft,
    setProfileDraft,
    profileFeedback,
    confirmClearHistory,
    setConfirmClearHistory,
    handleSaveProfile,
    handlePreferenceToggle,
    userInitials,
  } = profileState
  const {
    historyList,
    setHistoryList,
    setExpandedHistoryId,
  } = history

  return (
    <VStack spacing={5} align="stretch" w="100%" maxW="720px" mx="auto">
      <Box px={1}>
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="0.05em"
          color={primaryGreen}
        >
          Profile • Pengaturan Pengguna Lokal
        </Text>
        <Text
          fontFamily="'Figtree', sans-serif"
          fontSize={{ base: '2xl', sm: '3xl' }}
          fontWeight="extrabold"
          color={textMain}
          mt={1}
        >
          Profil & Preferensi CuPI
        </Text>
      </Box>

      {/* Kartu Identitas Pengguna Lokal */}
      <Card
        surface="sage"
        title={profile.displayName}
        subtitle={`${profile.contextRole} • Mode Penyimpanan Perangkat Lokal`}
        headerAction={
          <Box
            as="button"
            type="button"
            onClick={() => {
              setProfileDraft(profile)
              setIsEditingProfile((prev) => !prev)
            }}
            px={3}
            py={1.5}
            borderRadius="lg"
            bg={isEditingProfile ? surfaceInteractive : primaryBtnBg}
            color={isEditingProfile ? textMain : primaryBtnText}
            fontSize="xs"
            fontWeight="bold"
            cursor="pointer"
          >
            {isEditingProfile ? 'Batal' : 'Ubah Profil'}
          </Box>
        }
      >
        {profileFeedback && (
          <Box
            mb={3}
            px={3}
            py={2}
            borderRadius="lg"
            bg={surfaceInteractive}
            fontSize="xs"
            fontWeight="bold"
            color={primaryGreen}
          >
            {profileFeedback}
          </Box>
        )}

        <HStack spacing={3.5}>
          <Flex
            w="48px"
            h="48px"
            borderRadius="xl"
            bg={primaryBtnBg}
            color={primaryBtnText}
            align="center"
            justify="center"
            fontFamily="'Figtree', sans-serif"
            fontSize="lg"
            fontWeight="extrabold"
            flexShrink={0}
          >
            {userInitials}
          </Flex>
          <Box fontSize="xs" color={textMuted}>
            <Text color={textMain} fontWeight="semibold">
              Catatan Kontak / Label Lokal:{' '}
              {profile.contactNote ? profile.contactNote : 'Belum diisi (opsional)'}
            </Text>
            <Text mt={0.5}>
              Tidak memerlukan login akun. Data hanya disimpan pada browser perangkat ini.
            </Text>
          </Box>
        </HStack>

        {isEditingProfile && (
          <Box
            as="form"
            onSubmit={handleSaveProfile}
            mt={4}
            pt={4}
            borderTop="1px solid"
            borderColor={borderSubtle}
          >
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3} mb={3}>
              <Box>
                <Text fontSize="xs" fontWeight="semibold" mb={1}>
                  Nama Tampilan
                </Text>
                <Box
                  as="input"
                  type="text"
                  value={profileDraft.displayName}
                  onChange={(e) =>
                    setProfileDraft((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }))
                  }
                  w="100%"
                  px={3}
                  py={1.5}
                  fontSize="xs"
                  bg={inputBg}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={borderSubtle}
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="semibold" mb={1}>
                  Konteks Penggunaan
                </Text>
                <Box
                  as="input"
                  type="text"
                  value={profileDraft.contextRole}
                  onChange={(e) =>
                    setProfileDraft((prev) => ({
                      ...prev,
                      contextRole: e.target.value,
                    }))
                  }
                  w="100%"
                  px={3}
                  py={1.5}
                  fontSize="xs"
                  bg={inputBg}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={borderSubtle}
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="semibold" mb={1}>
                  Email / Catatan Lokal
                </Text>
                <Box
                  as="input"
                  type="text"
                  value={profileDraft.contactNote}
                  onChange={(e) =>
                    setProfileDraft((prev) => ({
                      ...prev,
                      contactNote: e.target.value,
                    }))
                  }
                  placeholder="Opsional"
                  w="100%"
                  px={3}
                  py={1.5}
                  fontSize="xs"
                  bg={inputBg}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={borderSubtle}
                />
              </Box>
            </SimpleGrid>

            <Flex justify="flex-end">
              <Box
                as="button"
                type="submit"
                px={4}
                py={1.5}
                borderRadius="md"
                bg={primaryBtnBg}
                color={primaryBtnText}
                fontSize="xs"
                fontWeight="bold"
                cursor="pointer"
              >
                Simpan Profil
              </Box>
            </Flex>
          </Box>
        )}
      </Card>

      {/* Daftar Preferensi Fungsional dengan Divider Bersih */}
      <Card
        surface="sage"
        title="Preferensi Pemeriksaan & Tampilan"
        subtitle="Mengatur perilaku evaluasi kondisi makanan dan penyimpanan riwayat."
        footer={
          <Flex align="center" justify="space-between" flexWrap="wrap" gap={2}>
            <Text fontSize="xs" color={textMuted}>
              Riwayat tersimpan di browser: {historyList.length} item
            </Text>

            {!confirmClearHistory ? (
              <Box
                as="button"
                type="button"
                onClick={() => setConfirmClearHistory(true)}
                fontSize="xs"
                fontWeight="bold"
                color={redStatus}
                cursor="pointer"
              >
                Kosongkan Riwayat Lokal
              </Box>
            ) : (
              <HStack spacing={2}>
                <Box
                  as="button"
                  type="button"
                  onClick={() => {
                    setHistoryList([])
                    setExpandedHistoryId(null)
                    setConfirmClearHistory(false)
                  }}
                  px={2.5}
                  py={1}
                  borderRadius="md"
                  bg={redStatus}
                  color="#FFFFFF"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  Ya, Hapus Semua
                </Box>
                <Box
                  as="button"
                  type="button"
                  onClick={() => setConfirmClearHistory(false)}
                  px={2.5}
                  py={1}
                  borderRadius="md"
                  bg={surfaceCream}
                  fontSize="xs"
                  fontWeight="semibold"
                >
                  Batal
                </Box>
              </HStack>
            )}
          </Flex>
        }
      >
        <VStack
          spacing={3.5}
          align="stretch"
          divider={<Box borderTop="1px solid" borderColor={borderSubtle} />}
        >
          <Flex align="center" justify="space-between" gap={3}>
            <Box>
              <Text fontSize="xs" fontWeight="bold" color={textMain}>
                Tema Tampilan (Light / Dark)
              </Text>
              <Text fontSize="11px" color={textMuted}>
                {colorMode === 'light'
                  ? 'Mode Terang aktif (Fresh Botanical Leaf & Warm Cream)'
                  : 'Mode Gelap aktif (Deep Forest Green)'}
              </Text>
            </Box>
            <Box
              as="button"
              type="button"
              onClick={toggleColorMode}
              px={3}
              py={1.5}
              borderRadius="md"
              bg={surfaceCream}
              border="1px solid"
              borderColor={borderStrong}
              fontSize="xs"
              fontWeight="bold"
              color={textMain}
              cursor="pointer"
            >
              Ubah ke {colorMode === 'light' ? 'Dark' : 'Light'}
            </Box>
          </Flex>

          <Flex align="center" justify="space-between" gap={3}>
            <Box>
              <Text fontSize="xs" fontWeight="bold" color={textMain}>
                Simpan Otomatis ke History Track
              </Text>
              <Text fontSize="11px" color={textMuted}>
                Simpan setiap hasil pemeriksaan baru ke riwayat perangkat secara langsung.
              </Text>
            </Box>
            <Box
              as="button"
              type="button"
              onClick={() => handlePreferenceToggle('autoSaveHistory')}
              px={3}
              py={1}
              borderRadius="md"
              fontSize="xs"
              fontWeight="bold"
              bg={profile.autoSaveHistory ? primaryBtnBg : surfaceCream}
              color={profile.autoSaveHistory ? primaryBtnText : textMuted}
              border="1px solid"
              borderColor={profile.autoSaveHistory ? primaryBtnBg : borderSubtle}
              cursor="pointer"
            >
              {profile.autoSaveHistory ? 'Aktif' : 'Nonaktif'}
            </Box>
          </Flex>

          <Flex align="center" justify="space-between" gap={3}>
            <Box>
              <Text fontSize="xs" fontWeight="bold" color={textMain}>
                Batas Peringatan Dini Suhu Ruang (2 Jam)
              </Text>
              <Text fontSize="11px" color={textMuted}>
                Tandai status Perlu perhatian saat makanan matang berada di suhu ruang selama 2 jam.
              </Text>
            </Box>
            <Box
              as="button"
              type="button"
              onClick={() => handlePreferenceToggle('strictRoomTempAlert')}
              px={3}
              py={1}
              borderRadius="md"
              fontSize="xs"
              fontWeight="bold"
              bg={profile.strictRoomTempAlert ? primaryBtnBg : surfaceCream}
              color={profile.strictRoomTempAlert ? primaryBtnText : textMuted}
              border="1px solid"
              borderColor={profile.strictRoomTempAlert ? primaryBtnBg : borderSubtle}
              cursor="pointer"
            >
              {profile.strictRoomTempAlert ? 'Ketat (2 Jam)' : 'Standar'}
            </Box>
          </Flex>

          <Flex align="center" justify="space-between" gap={3}>
            <Box>
              <Text fontSize="xs" fontWeight="bold" color={textMain}>
                Panduan Pencegahan Food Waste Bertanggung Jawab
              </Text>
              <Text fontSize="11px" color={textMuted}>
                Tampilkan saran pemanfaatan hanya saat waktu dan suhu makanan masih memenuhi syarat.
              </Text>
            </Box>
            <Box
              as="button"
              type="button"
              onClick={() => handlePreferenceToggle('showWasteGuidance')}
              px={3}
              py={1}
              borderRadius="md"
              fontSize="xs"
              fontWeight="bold"
              bg={profile.showWasteGuidance ? primaryBtnBg : surfaceCream}
              color={profile.showWasteGuidance ? primaryBtnText : textMuted}
              border="1px solid"
              borderColor={profile.showWasteGuidance ? primaryBtnBg : borderSubtle}
              cursor="pointer"
            >
              {profile.showWasteGuidance ? 'Aktif' : 'Nonaktif'}
            </Box>
          </Flex>
        </VStack>
      </Card>
    </VStack>
  )
}

export default ProfilePage
