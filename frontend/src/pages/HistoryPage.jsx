import { Box, Flex, HStack, VStack, Text } from '@chakra-ui/react'
import Card from '../components/Card'
import { useCupiTokens } from '../theme/useCupiTokens'

function HistoryPage({ setActiveNav, history }) {
  const {
    surfaceSage,
    surfaceCream,
    surfaceInteractive,
    primaryGreen,
    primaryBtnBg,
    primaryBtnText,
    primaryBtnHover,
    textMain,
    textMuted,
    borderSubtle,
    inputBg,
    redStatus,
  } = useCupiTokens()
  const {
    historyList,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    expandedHistoryId,
    setExpandedHistoryId,
    filteredHistory,
    handleDeleteHistoryItem,
  } = history

  return (
    <VStack spacing={5} align="stretch" w="100%">
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'flex-start', sm: 'flex-end' }}
        justify="space-between"
        gap={3}
        px={1}
      >
        <Box>
          <Text
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="0.05em"
            color={primaryGreen}
          >
            History Track • Penyimpanan Browser Lokal
          </Text>
          <Text
            fontFamily="'Figtree', sans-serif"
            fontSize={{ base: '2xl', sm: '3xl' }}
            fontWeight="extrabold"
            color={textMain}
            lineHeight="1.2"
            mt={1}
          >
            Catatan Riwayat Pemeriksaan Makanan
          </Text>
        </Box>

        <Box
          as="button"
          type="button"
          onClick={() => setActiveNav('CuPI')}
          px={4}
          py={2}
          borderRadius="lg"
          bg={primaryBtnBg}
          color={primaryBtnText}
          fontSize="xs"
          fontWeight="bold"
          cursor="pointer"
          _hover={{ bg: primaryBtnHover }}
        >
          + Pemeriksaan Baru
        </Box>
      </Flex>

      {/* Bar Pencarian & Filter Status */}
      <Card surface="sage" compact>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'center' }}
          justify="space-between"
          gap={3}
        >
          <Box
            as="input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama makanan atau kategori..."
            w={{ base: '100%', md: '280px' }}
            px={3}
            py={1.5}
            fontSize="xs"
            bg={inputBg}
            color={textMain}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderSubtle}
          />

          <HStack spacing={1.5} flexWrap="wrap">
            {[
              'Semua',
              'Perlu perhatian',
              'Risiko terindikasi',
              'Perlu informasi tambahan',
              'Tidak dapat dinilai',
            ].map((st) => {
              const active = statusFilter === st
              return (
                <Box
                  as="button"
                  type="button"
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  px={2.5}
                  py={1}
                  borderRadius="md"
                  fontSize="11px"
                  fontWeight={active ? 'bold' : 'medium'}
                  bg={active ? primaryBtnBg : surfaceCream}
                  color={active ? primaryBtnText : textMuted}
                  border="1px solid"
                  borderColor={active ? primaryBtnBg : borderSubtle}
                  cursor="pointer"
                >
                  {st}
                </Box>
              )
            })}
          </HStack>
        </Flex>
      </Card>

      {/* Daftar Log Riwayat Vertikal */}
      {filteredHistory.length === 0 ? (
        <Card
          surface="cream"
          title="Belum Ada Catatan Pemeriksaan"
          description={
            historyList.length === 0
              ? 'Riwayat pemeriksaan lokal Anda masih kosong. Lakukan pemeriksaan makanan pertama di halaman CuPI.'
              : 'Tidak ada catatan riwayat yang cocok dengan kata kunci atau filter status yang dipilih.'
          }
        >
          <HStack spacing={2.5} mt={2}>
            {historyList.length > 0 && (
              <Box
                as="button"
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('Semua')
                }}
                px={3}
                py={1.5}
                borderRadius="md"
                bg={surfaceSage}
                border="1px solid"
                borderColor={borderSubtle}
                fontSize="xs"
                fontWeight="bold"
              >
                Reset Filter
              </Box>
            )}
            <Box
              as="button"
              type="button"
              onClick={() => setActiveNav('CuPI')}
              px={3.5}
              py={1.5}
              borderRadius="md"
              bg={primaryBtnBg}
              color={primaryBtnText}
              fontSize="xs"
              fontWeight="bold"
            >
              Ke Halaman Pemeriksaan
            </Box>
          </HStack>
        </Card>
      ) : (
        <VStack spacing={3} align="stretch">
          {filteredHistory.map((item) => {
            const isExpanded = expandedHistoryId === item.id
            return (
              <Card
                key={item.id}
                surface={isExpanded ? 'cream' : 'sage'}
                status={item.status}
                isActive={isExpanded}
                compact
                onClick={() =>
                  setExpandedHistoryId((prev) =>
                    prev === item.id ? null : item.id
                  )
                }
                title={item.foodName}
                subtitle={`${item.createdAt} • ${item.storageLabel}${
                  item.durationHours ? ` (${item.durationHours} jam)` : ''
                }`}
                badge={item.status}
                headerAction={
                  item.isDemo ? (
                    <Box
                      px={2}
                      py={0.5}
                      borderRadius="sm"
                      bg={surfaceInteractive}
                      fontSize="10px"
                      fontWeight="bold"
                      color={textMuted}
                    >
                      Contoh data (Mode demo)
                    </Box>
                  ) : null
                }
              >
                <Flex align="flex-start" gap={3}>
                  {item.imagePreview && (
                    <Box
                      as="img"
                      src={item.imagePreview}
                      alt={item.foodName}
                      w="48px"
                      h="48px"
                      objectFit="cover"
                      borderRadius="md"
                      flexShrink={0}
                    />
                  )}
                  <Text fontSize="xs" color={textMain} lineHeight="1.55" flex="1">
                    {item.summary}
                  </Text>
                </Flex>

                {/* Rincian Terbuka Saat Item Diklik */}
                {isExpanded && (
                  <Box
                    mt={3.5}
                    pt={3}
                    borderTop="1px solid"
                    borderColor={borderSubtle}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <VStack spacing={2} align="stretch" fontSize="xs">
                      <Text color={textMain}>
                        <Box as="span" fontWeight="bold" color={primaryGreen}>
                          Waktu & Suhu:{' '}
                        </Box>
                        {item.timeStorageFactor}
                      </Text>
                      <Text color={textMain}>
                        <Box as="span" fontWeight="bold" color={primaryGreen}>
                          Observasi Indera:{' '}
                        </Box>
                        {item.sensoryFactor}
                      </Text>
                      <Text color={textMain}>
                        <Box as="span" fontWeight="bold" color={primaryGreen}>
                          Rekomendasi:{' '}
                        </Box>
                        {item.recommendation}
                      </Text>
                      {item.notes && (
                        <Text color={textMuted}>
                          <Box as="span" fontWeight="bold">
                            Catatan:{' '}
                          </Box>
                          {item.notes}
                        </Text>
                      )}
                    </VStack>

                    <Flex justify="space-between" align="center" mt={3} pt={2}>
                      <Box
                        as="button"
                        type="button"
                        onClick={() => handleDeleteHistoryItem(item.id)}
                        fontSize="11px"
                        fontWeight="bold"
                        color={redStatus}
                        cursor="pointer"
                      >
                        Hapus Catatan Ini
                      </Box>
                      <Box
                        as="button"
                        type="button"
                        onClick={() => setExpandedHistoryId(null)}
                        fontSize="11px"
                        fontWeight="bold"
                        color={primaryGreen}
                        cursor="pointer"
                      >
                        Tutup Rincian
                      </Box>
                    </Flex>
                  </Box>
                )}
              </Card>
            )
          })}
        </VStack>
      )}
    </VStack>
  )
}

export default HistoryPage
