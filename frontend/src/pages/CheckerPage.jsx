import { Box, Flex, HStack, VStack, SimpleGrid, Text } from '@chakra-ui/react'
import Card from '../components/Card'
import { FOOD_CATEGORIES, STORAGE_OPTIONS, SENSORY_CHECKS } from '../constants/food'
import { useCupiTokens } from '../theme/useCupiTokens'

function CheckerPage({ profile, setActiveNav, check }) {
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
    borderStrong,
    inputBg,
    amberStatus,
    amberBg,
    amberText,
    redStatus,
    redBg,
    redText,
    getStatusTokens,
  } = useCupiTokens()
  const {
    foodName,
    setFoodName,
    categoryId,
    setCategoryId,
    durationKnown,
    setDurationKnown,
    durationHours,
    setDurationHours,
    storageId,
    setStorageId,
    sensoryFlags,
    sensoryUnknown,
    notes,
    setNotes,
    imagePreview,
    imageFileName,
    uploadError,
    isDraggingFile,
    setIsDraggingFile,
    formErrors,
    setFormErrors,
    isAnalyzing,
    assessmentResult,
    isResultSaved,
    fileInputRef,
    resultSectionRef,
    handleFileProcess,
    handleFileInputChange,
    handleRemoveImage,
    handleToggleSensoryFlag,
    handleToggleSensoryUnknown,
    handleRunAssessment,
    handleSaveToHistoryManual,
    handleResetForm,
    handleFillSampleInput,
  } = check

  return (
    <VStack spacing={6} align="stretch" w="100%">
      {/* Editorial Header Terbuka (Tanpa Card-in-Card) */}
      <Box px={{ base: 1, sm: 2 }}>
        <HStack spacing={2} mb={2}>
          <Box w="7px" h="7px" borderRadius="full" bg={primaryGreen} />
          <Text
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="0.04em"
            textTransform="uppercase"
            color={primaryGreen}
          >
            CuPI • Food Condition & Safety Assistant
          </Text>
        </HStack>

        <Text
          fontFamily="'Figtree', sans-serif"
          fontSize={{ base: '2xl', sm: '3xl' }}
          fontWeight="extrabold"
          letterSpacing="-0.02em"
          lineHeight="1.2"
          color={textMain}
        >
          Periksa Kelayakan Makanan dari Waktu, Penyimpanan, dan Fisik
        </Text>

        <Text fontSize="sm" color={textMuted} mt={2} maxW="720px" lineHeight="1.65">
          Penilaian mengutamakan{' '}
          <Box as="span" fontWeight="semibold" color={textMain}>
            durasi waktu dan kondisi suhu penyimpanan
          </Box>{' '}
          sebagai faktor penentu utama, dilengkapi pengamatan indera serta foto konteks visual. Makanan yang tampak atau berbau normal tetap berisiko apabila melewati batas waktu suhu ruang.
        </Text>
      </Box>

      {/* Panel Tunggal Pemeriksaan Makanan (Tanpa Nested Cards) */}
      <Card
        as="form"
        onSubmit={handleRunAssessment}
        surface="sage"
        title="Pemeriksaan Kondisi Makanan"
        subtitle="Isi data waktu, tempat penyimpanan, dan hasil pengamatan langsung Anda."
        headerAction={
          <HStack spacing={1.5} flexWrap="wrap">
            <Text fontSize="11px" color={textMuted} mr={1}>
              Uji contoh:
            </Text>
            <Box
              as="button"
              type="button"
              onClick={() => handleFillSampleInput('fridge_watch')}
              px={2.5}
              py={1}
              borderRadius="md"
              bg={surfaceCream}
              border="1px solid"
              borderColor={borderSubtle}
              fontSize="11px"
              fontWeight="semibold"
              color={textMain}
              cursor="pointer"
              _hover={{ borderColor: borderStrong, bg: surfaceInteractive }}
            >
              Simpan Kulkas (14j)
            </Box>
            <Box
              as="button"
              type="button"
              onClick={() => handleFillSampleInput('room_risk')}
              px={2.5}
              py={1}
              borderRadius="md"
              bg={surfaceCream}
              border="1px solid"
              borderColor={borderSubtle}
              fontSize="11px"
              fontWeight="semibold"
              color={textMain}
              cursor="pointer"
              _hover={{ borderColor: borderStrong, bg: surfaceInteractive }}
            >
              Suhu Ruang (5.5j)
            </Box>
          </HStack>
        }
        footer={
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            align={{ base: 'stretch', sm: 'center' }}
            justify="space-between"
            gap={3}
          >
            <Text fontSize="xs" color={textMuted}>
              {profile.autoSaveHistory
                ? 'Hasil pemeriksaan otomatis dicatat ke History Track lokal.'
                : 'Penyimpanan otomatis nonaktif — Anda dapat menyimpan manual setelah evaluasi.'}
            </Text>

            <HStack spacing={2.5} justify="flex-end">
              <Box
                as="button"
                type="button"
                onClick={handleResetForm}
                px={4}
                py={2}
                borderRadius="lg"
                bg={surfaceCream}
                color={textMain}
                border="1px solid"
                borderColor={borderSubtle}
                fontSize="xs"
                fontWeight="bold"
                cursor="pointer"
                _hover={{ bg: surfaceInteractive }}
              >
                Reset
              </Box>

              <Box
                as="button"
                type="submit"
                disabled={isAnalyzing}
                px={5}
                py={2}
                borderRadius="lg"
                bg={primaryBtnBg}
                color={primaryBtnText}
                fontSize="xs"
                fontWeight="bold"
                cursor={isAnalyzing ? 'wait' : 'pointer'}
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
                _hover={{
                  bg: isAnalyzing ? primaryBtnBg : primaryBtnHover,
                  transform: isAnalyzing ? 'none' : 'translateY(-1px)',
                }}
                _active={{ transform: 'scale(0.98)' }}
              >
                {isAnalyzing ? (
                  <>
                    <Box
                      w="7px"
                      h="7px"
                      borderRadius="full"
                      bg={primaryBtnText}
                      animation="loadingDotPulse 0.9s infinite"
                    />
                    <span>Memeriksa Riwayat Waktu & Suhu...</span>
                  </>
                ) : (
                  <span>Periksa Kondisi Makanan</span>
                )}
              </Box>
            </HStack>
          </Flex>
        }
      >
        <VStack spacing={6} align="stretch">
          {/* SEKSI 1: Nama & Kategori Makanan */}
          <Box>
            <Text
              fontSize="xs"
              fontWeight="bold"
              color={primaryGreen}
              mb={3}
            >
              1. Identitas & Jenis Makanan
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text
                  as="label"
                  htmlFor="food-name-input"
                  fontSize="xs"
                  fontWeight="semibold"
                  display="block"
                  mb={1.5}
                >
                  Nama Makanan *
                </Text>
                <Box
                  as="input"
                  id="food-name-input"
                  type="text"
                  value={foodName}
                  onChange={(e) => {
                    setFoodName(e.target.value)
                    if (formErrors.foodName) {
                      setFormErrors((prev) => ({ ...prev, foodName: '' }))
                    }
                  }}
                  placeholder="Mis. Sayur Sop, Ayam Goreng, Puding Susu"
                  w="100%"
                  px={3.5}
                  py={2}
                  fontSize="sm"
                  bg={inputBg}
                  color={textMain}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={formErrors.foodName ? redStatus : borderSubtle}
                  _focusVisible={{
                    outline: '2px solid',
                    outlineColor: primaryGreen,
                  }}
                />
                {formErrors.foodName && (
                  <Text fontSize="xs" color={redStatus} fontWeight="semibold" mt={1}>
                    {formErrors.foodName}
                  </Text>
                )}
              </Box>

              <Box>
                <Text
                  as="label"
                  htmlFor="food-category-select"
                  fontSize="xs"
                  fontWeight="semibold"
                  display="block"
                  mb={1.5}
                >
                  Kelompok Makanan
                </Text>
                <Box
                  as="select"
                  id="food-category-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  w="100%"
                  px={3}
                  py={2}
                  fontSize="sm"
                  bg={inputBg}
                  color={textMain}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderSubtle}
                  _focusVisible={{
                    outline: '2px solid',
                    outlineColor: primaryGreen,
                  }}
                >
                  {FOOD_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </Box>
                <Text fontSize="11px" color={textMuted} mt={1}>
                  {
                    (
                      FOOD_CATEGORIES.find((c) => c.id === categoryId) ||
                      FOOD_CATEGORIES[0]
                    ).hint
                  }
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Garis Pemisah Seksi */}
          <Box borderTop="1px solid" borderColor={borderSubtle} />

          {/* SEKSI 2: Faktor Utama — Durasi Waktu & Kondisi Penyimpanan */}
          <Box>
            <Flex align="center" justify="space-between" mb={3} flexWrap="wrap" gap={2}>
              <Text fontSize="xs" fontWeight="bold" color={primaryGreen}>
                2. Riwayat Waktu & Suhu Penyimpanan (Penentu Utama)
              </Text>
              <Text fontSize="11px" color={textMuted}>
                Wajib diketahui untuk menilai keamanan pangan
              </Text>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              {/* Input Durasi Waktu */}
              <Box>
                <Text fontSize="xs" fontWeight="semibold" mb={2}>
                  Durasi sejak dimasak / dibeli / disimpan
                </Text>

                <HStack spacing={2} mb={2.5}>
                  <Box
                    as="button"
                    type="button"
                    onClick={() => setDurationKnown('known')}
                    px={3}
                    py={1.5}
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight={durationKnown === 'known' ? 'bold' : 'medium'}
                    bg={durationKnown === 'known' ? primaryBtnBg : surfaceCream}
                    color={durationKnown === 'known' ? primaryBtnText : textMain}
                    border="1px solid"
                    borderColor={durationKnown === 'known' ? primaryBtnBg : borderSubtle}
                    cursor="pointer"
                  >
                    Waktu Diketahui
                  </Box>
                  <Box
                    as="button"
                    type="button"
                    onClick={() => {
                      setDurationKnown('unknown')
                      setDurationHours('')
                      if (formErrors.durationHours) {
                        setFormErrors((prev) => ({ ...prev, durationHours: '' }))
                      }
                    }}
                    px={3}
                    py={1.5}
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight={durationKnown === 'unknown' ? 'bold' : 'medium'}
                    bg={durationKnown === 'unknown' ? primaryBtnBg : surfaceCream}
                    color={durationKnown === 'unknown' ? primaryBtnText : textMain}
                    border="1px solid"
                    borderColor={durationKnown === 'unknown' ? primaryBtnBg : borderSubtle}
                    cursor="pointer"
                  >
                    Tidak Diketahui / Ragu
                  </Box>
                </HStack>

                {durationKnown === 'known' ? (
                  <Box>
                    <HStack spacing={2} align="center" flexWrap="wrap">
                      <Box
                        as="input"
                        type="number"
                        step="0.5"
                        min="0"
                        max="720"
                        value={durationHours}
                        onChange={(e) => {
                          setDurationHours(e.target.value)
                          if (formErrors.durationHours) {
                            setFormErrors((prev) => ({ ...prev, durationHours: '' }))
                          }
                        }}
                        placeholder="Mis. 3"
                        w="110px"
                        px={3}
                        py={1.5}
                        fontSize="sm"
                        bg={inputBg}
                        color={textMain}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor={formErrors.durationHours ? redStatus : borderSubtle}
                      />
                      <Text fontSize="xs" fontWeight="semibold" color={textMuted}>
                        jam
                      </Text>

                      <HStack spacing={1}>
                        {['1', '2', '4', '6', '12', '24'].map((hr) => (
                          <Box
                            as="button"
                            type="button"
                            key={hr}
                            onClick={() => {
                              setDurationHours(hr)
                              if (formErrors.durationHours) {
                                setFormErrors((prev) => ({ ...prev, durationHours: '' }))
                              }
                            }}
                            px={2}
                            py={1}
                            borderRadius="md"
                            fontSize="11px"
                            fontWeight="semibold"
                            bg={durationHours === hr ? surfaceInteractive : surfaceCream}
                            border="1px solid"
                            borderColor={durationHours === hr ? primaryGreen : borderSubtle}
                            color={textMain}
                            cursor="pointer"
                          >
                            {hr}j
                          </Box>
                        ))}
                      </HStack>
                    </HStack>
                    {formErrors.durationHours && (
                      <Text fontSize="xs" color={redStatus} fontWeight="semibold" mt={1}>
                        {formErrors.durationHours}
                      </Text>
                    )}
                  </Box>
                ) : (
                  <Text fontSize="xs" color={textMuted} lineHeight="1.5">
                    Bila waktu tidak diketahui, CuPI akan memberikan status{' '}
                    <Box as="span" fontWeight="semibold" color={textMain}>
                      Perlu informasi tambahan
                    </Box>{' '}
                    dan tidak mengasumsikan makanan aman.
                  </Text>
                )}
              </Box>

              {/* Pilihan Tempat & Suhu Penyimpanan */}
              <Box>
                <Text fontSize="xs" fontWeight="semibold" mb={2}>
                  Kondisi Penyimpanan
                </Text>
                <VStack spacing={1.5} align="stretch">
                  {STORAGE_OPTIONS.map((opt) => {
                    const selected = storageId === opt.id
                    return (
                      <Flex
                        as="button"
                        type="button"
                        key={opt.id}
                        onClick={() => setStorageId(opt.id)}
                        align="center"
                        justify="space-between"
                        px={3}
                        py={2}
                        textAlign="left"
                        borderRadius="lg"
                        bg={selected ? surfaceInteractive : surfaceCream}
                        border="1px solid"
                        borderColor={selected ? primaryGreen : borderSubtle}
                        cursor="pointer"
                        _hover={{ borderColor: borderStrong }}
                      >
                        <Box pr={2}>
                          <Text fontSize="xs" fontWeight="bold" color={textMain}>
                            {opt.label}
                          </Text>
                          <Text fontSize="11px" color={textMuted}>
                            {opt.desc}
                          </Text>
                        </Box>
                        <Box
                          w="12px"
                          h="12px"
                          borderRadius="full"
                          border="2px solid"
                          borderColor={selected ? primaryGreen : borderStrong}
                          bg={selected ? primaryGreen : 'transparent'}
                          flexShrink={0}
                        />
                      </Flex>
                    )
                  })}
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Garis Pemisah Seksi */}
          <Box borderTop="1px solid" borderColor={borderSubtle} />

          {/* SEKSI 3: Observasi Indera & Foto Konteks Visual */}
          <SimpleGrid columns={{ base: 1, md: 12 }} spacing={5}>
            {/* Observasi Indera (7 Kolom) */}
            <Box gridColumn={{ base: 'span 1', md: 'span 7' }}>
              <Text fontSize="xs" fontWeight="bold" color={primaryGreen} mb={1}>
                3. Observasi Indera (Bau, Tekstur, Warna)
              </Text>
              <Text fontSize="11px" color={textMuted} mb={2.5}>
                Centang bila ada perubahan fisik. Biarkan kosong bila tidak ditemukan tanda di bawah.
              </Text>

              <VStack spacing={1.5} align="stretch">
                {SENSORY_CHECKS.map((chk) => {
                  const checked = sensoryFlags.includes(chk.id)
                  return (
                    <Flex
                      as="button"
                      type="button"
                      key={chk.id}
                      onClick={() => handleToggleSensoryFlag(chk.id)}
                      align="center"
                      justify="space-between"
                      px={3}
                      py={2}
                      textAlign="left"
                      borderRadius="lg"
                      bg={checked ? redBg : surfaceCream}
                      border="1px solid"
                      borderColor={checked ? redStatus : borderSubtle}
                      cursor="pointer"
                    >
                      <Box pr={2}>
                        <Text
                          fontSize="xs"
                          fontWeight="bold"
                          color={checked ? redText : textMain}
                        >
                          {chk.label}
                        </Text>
                        <Text fontSize="11px" color={textMuted}>
                          {chk.detail}
                        </Text>
                      </Box>
                      <Flex
                        w="16px"
                        h="16px"
                        align="center"
                        justify="center"
                        borderRadius="sm"
                        border="1.5px solid"
                        borderColor={checked ? redStatus : borderStrong}
                        bg={checked ? redStatus : 'transparent'}
                        color="#FFFFFF"
                        flexShrink={0}
                      >
                        {checked && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </Flex>
                    </Flex>
                  )
                })}

                <Flex
                  as="button"
                  type="button"
                  onClick={handleToggleSensoryUnknown}
                  align="center"
                  justify="space-between"
                  px={3}
                  py={2}
                  textAlign="left"
                  borderRadius="lg"
                  bg={sensoryUnknown ? amberBg : surfaceCream}
                  border="1px solid"
                  borderColor={sensoryUnknown ? amberStatus : borderSubtle}
                  cursor="pointer"
                >
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color={sensoryUnknown ? amberText : textMain}
                  >
                    Belum memeriksa aroma/tekstur secara langsung
                  </Text>
                  <Box
                    w="14px"
                    h="14px"
                    borderRadius="sm"
                    border="1.5px solid"
                    borderColor={sensoryUnknown ? amberStatus : borderStrong}
                    bg={sensoryUnknown ? amberStatus : 'transparent'}
                    flexShrink={0}
                  />
                </Flex>
              </VStack>
            </Box>

            {/* Unggah Foto Konteks Visual & Catatan (5 Kolom) */}
            <Box gridColumn={{ base: 'span 1', md: 'span 5' }}>
              <Text fontSize="xs" fontWeight="bold" color={primaryGreen} mb={1}>
                4. Foto Konteks Visual & Catatan (Opsional)
              </Text>
              <Text fontSize="11px" color={textMuted} mb={2.5}>
                Sebagai dokumentasi riwayat, bukan penentu tunggal keamanan.
              </Text>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />

              {!imagePreview ? (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  p={3.5}
                  textAlign="center"
                  borderRadius="lg"
                  bg={isDraggingFile ? surfaceInteractive : surfaceCream}
                  border="1.5px dashed"
                  borderColor={
                    uploadError
                      ? redStatus
                      : isDraggingFile
                      ? primaryGreen
                      : borderStrong
                  }
                  cursor="pointer"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDraggingFile(true)
                  }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDraggingFile(false)
                    const file =
                      e.dataTransfer.files && e.dataTransfer.files[0]
                    if (file) handleFileProcess(file)
                  }}
                  _hover={{ borderColor: primaryGreen, bg: surfaceInteractive }}
                >
                  <Box color={primaryGreen} mb={1}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </Box>
                  <Text fontSize="xs" fontWeight="bold" color={textMain}>
                    Pilih foto makanan (opsional)
                  </Text>
                  <Text fontSize="11px" color={textMuted}>
                    JPG, PNG, WEBP • Maks. 4 MB
                  </Text>
                </Flex>
              ) : (
                <Flex
                  align="center"
                  gap={3}
                  p={2.5}
                  borderRadius="lg"
                  bg={surfaceCream}
                  border="1px solid"
                  borderColor={borderStrong}
                >
                  <Box
                    as="img"
                    src={imagePreview}
                    alt="Preview makanan"
                    w="54px"
                    h="54px"
                    objectFit="cover"
                    borderRadius="md"
                    flexShrink={0}
                  />
                  <Box flex="1" minW={0}>
                    <Text fontSize="xs" fontWeight="bold" color={textMain} isTruncated>
                      {imageFileName || 'Foto Terlampir'}
                    </Text>
                    <HStack spacing={2.5} mt={1}>
                      <Box
                        as="button"
                        type="button"
                        onClick={() =>
                          fileInputRef.current && fileInputRef.current.click()
                        }
                        fontSize="11px"
                        fontWeight="semibold"
                        color={primaryGreen}
                      >
                        Ganti
                      </Box>
                      <Box
                        as="button"
                        type="button"
                        onClick={handleRemoveImage}
                        fontSize="11px"
                        fontWeight="semibold"
                        color={redStatus}
                      >
                        Hapus
                      </Box>
                    </HStack>
                  </Box>
                </Flex>
              )}

              {uploadError && (
                <Text fontSize="xs" color={redStatus} fontWeight="semibold" mt={1}>
                  {uploadError}
                </Text>
              )}

              <Box mt={3}>
                <Text
                  as="label"
                  htmlFor="notes-textarea"
                  fontSize="xs"
                  fontWeight="semibold"
                  display="block"
                  mb={1}
                >
                  Catatan Tambahan
                </Text>
                <Box
                  as="textarea"
                  id="notes-textarea"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mis. Sudah pernah dipanaskan 1 kali..."
                  w="100%"
                  px={3}
                  py={2}
                  fontSize="xs"
                  bg={inputBg}
                  color={textMain}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderSubtle}
                />
              </Box>
            </Box>
          </SimpleGrid>
        </VStack>
      </Card>

      {/* ============================================================ */}
      {/* AREA HASIL PEMERIKSAAN (LEMBAR DIAGNOSTIK TERSTRUKTUR)       */}
      {/* ============================================================ */}
      {assessmentResult && (
        <Box
          ref={resultSectionRef}
          animation="pageFadeUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) both"
        >
          <Card
            surface="cream"
            status={assessmentResult.status}
            title={`Hasil Pemeriksaan: ${assessmentResult.foodName}`}
            subtitle={`${assessmentResult.categoryLabel} • Diperiksa ${assessmentResult.createdAt}`}
            badge={assessmentResult.status}
            footer={
              <Flex
                w="100%"
                align="center"
                justify="space-between"
                flexWrap="wrap"
                gap={3}
              >
                <Text fontSize="11px" color={textMuted}>
                  Panduan CuPI berdasarkan waktu, suhu, dan observasi pengguna (bukan pengganti uji laboratorium).
                </Text>

                <HStack spacing={2}>
                  {!isResultSaved ? (
                    <Box
                      as="button"
                      type="button"
                      onClick={handleSaveToHistoryManual}
                      px={3.5}
                      py={1.5}
                      borderRadius="lg"
                      bg={primaryBtnBg}
                      color={primaryBtnText}
                      fontSize="xs"
                      fontWeight="bold"
                      cursor="pointer"
                    >
                      Simpan ke History Track
                    </Box>
                  ) : (
                    <Text fontSize="xs" fontWeight="bold" color={primaryGreen}>
                      ✓ Tersimpan di History Track
                    </Text>
                  )}

                  <Box
                    as="button"
                    type="button"
                    onClick={() => setActiveNav('History Track')}
                    px={3}
                    py={1.5}
                    borderRadius="lg"
                    bg={surfaceSage}
                    border="1px solid"
                    borderColor={borderSubtle}
                    fontSize="xs"
                    fontWeight="bold"
                    color={textMain}
                    cursor="pointer"
                    _hover={{ bg: surfaceInteractive }}
                  >
                    Lihat History Track →
                  </Box>
                </HStack>
              </Flex>
            }
          >
            {/* Ringkasan Utama Status */}
            <Flex
              align="flex-start"
              gap={3.5}
              p={3.5}
              borderRadius="xl"
              bg={getStatusTokens(assessmentResult.status).bg}
              mb={4}
            >
              {assessmentResult.imagePreview && (
                <Box
                  as="img"
                  src={assessmentResult.imagePreview}
                  alt={assessmentResult.foodName}
                  w="64px"
                  h="64px"
                  objectFit="cover"
                  borderRadius="lg"
                  flexShrink={0}
                />
              )}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={getStatusTokens(assessmentResult.status).text}
                  lineHeight="1.5"
                >
                  {assessmentResult.summary}
                </Text>
                <Text fontSize="xs" color={textMuted} mt={1} lineHeight="1.55">
                  {assessmentResult.reasoning}
                </Text>
              </Box>
            </Flex>

            {/* Rincian Baris Diagnostik (Tanpa Grid Kartu Seragam) */}
            <VStack
              spacing={3}
              align="stretch"
              divider={<Box borderTop="1px solid" borderColor={borderSubtle} />}
            >
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                justify="space-between"
                gap={1}
              >
                <Text fontSize="xs" fontWeight="bold" color={primaryGreen} minW="210px">
                  Faktor Waktu & Penyimpanan
                </Text>
                <Text fontSize="xs" color={textMain} flex="1" lineHeight="1.55">
                  {assessmentResult.timeStorageFactor}
                </Text>
              </Flex>

              <Flex
                direction={{ base: 'column', sm: 'row' }}
                justify="space-between"
                gap={1}
              >
                <Text fontSize="xs" fontWeight="bold" color={primaryGreen} minW="210px">
                  Temuan Visual & Indera
                </Text>
                <Text fontSize="xs" color={textMain} flex="1" lineHeight="1.55">
                  {assessmentResult.sensoryFactor}
                </Text>
              </Flex>

              <Flex
                direction={{ base: 'column', sm: 'row' }}
                justify="space-between"
                gap={1}
              >
                <Text fontSize="xs" fontWeight="bold" color={primaryGreen} minW="210px">
                  Rekomendasi Tindakan
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color={textMain}
                  flex="1"
                  lineHeight="1.55"
                >
                  {assessmentResult.recommendation}
                </Text>
              </Flex>

              {profile.showWasteGuidance && assessmentResult.wasteGuidance && (
                <Flex
                  direction={{ base: 'column', sm: 'row' }}
                  justify="space-between"
                  gap={1}
                >
                  <Text fontSize="xs" fontWeight="bold" color={primaryGreen} minW="210px">
                    Pencegahan Food Waste
                  </Text>
                  <Text fontSize="xs" color={textMuted} flex="1" lineHeight="1.55">
                    {assessmentResult.wasteGuidance}
                  </Text>
                </Flex>
              )}
            </VStack>
          </Card>
        </Box>
      )}
    </VStack>
  )
}

export default CheckerPage
