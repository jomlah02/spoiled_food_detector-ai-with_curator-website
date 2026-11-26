import { FOOD_CATEGORIES, STORAGE_OPTIONS, SENSORY_CHECKS } from '../constants/food'

// Mesin Evaluasi Keamanan Pangan CuPI
// Aturan utama: Waktu & Suhu adalah penentu utama. Visual/indera normal TIDAK BOLEH menaikkan status yang berisiko karena waktu/suhu.
export function evaluateFoodCondition({
  foodName,
  categoryId,
  durationKnown,
  durationHours,
  storageId,
  sensoryFlags,
  sensoryUnknown,
  imagePreview,
  notes,
  strictRoomTempAlert,
}) {
  const category =
    FOOD_CATEGORIES.find((c) => c.id === categoryId) || FOOD_CATEGORIES[0]
  const storage =
    STORAGE_OPTIONS.find((s) => s.id === storageId) || STORAGE_OPTIONS[0]

  const parsedHours = Number(durationHours)
  const hasValidHours =
    durationKnown === 'known' &&
    durationHours !== '' &&
    !Number.isNaN(parsedHours) &&
    parsedHours >= 0

  const hasSensoryIssue = Array.isArray(sensoryFlags) && sensoryFlags.length > 0

  // 1. Jika ada temuan indera negatif (bau asam, lendir, jamur, kemasan gembung) -> Risiko terindikasi
  if (hasSensoryIssue) {
    const issueLabels = SENSORY_CHECKS.filter((item) =>
      sensoryFlags.includes(item.id)
    ).map((item) => item.label.toLowerCase())

    return {
      status: 'Risiko terindikasi',
      summary: `Terdeteksi tanda perubahan fisik atau indera pada "${foodName}" (${issueLabels.join(', ')}).`,
      timeStorageFactor: hasValidHours
        ? `Tercatat disimpan selama ${parsedHours} jam pada kondisi: ${storage.label}.`
        : `Tempat penyimpanan: ${storage.label} (durasi jam pasti tidak tercatat).`,
      sensoryFactor: `Temuan pengamatan pengguna: ${issueLabels.join('; ')}.`,
      reasoning:
        'Perubahan bau, tekstur berlendir, bercak jamur, atau wadah yang menggembung menandakan aktivitas pembusukan yang berisiko bagi kesehatan.',
      recommendation:
        'Jangan dikonsumsi dan jangan dicicipi. Buang makanan ke wadah tertutup dan jangan disalurkan untuk konsumsi pihak lain.',
      wasteGuidance: null,
    }
  }

  // 2. Jika data waktu atau penyimpanan tidak tersedia -> "Perlu informasi tambahan" atau "Tidak dapat dinilai"
  if (
    durationKnown === 'unknown' ||
    !hasValidHours ||
    storageId === 'unknown'
  ) {
    const isBothUnknown =
      (durationKnown === 'unknown' || !hasValidHours) && storageId === 'unknown'

    return {
      status: isBothUnknown ? 'Tidak dapat dinilai' : 'Perlu informasi tambahan',
      summary: isBothUnknown
        ? `Informasi belum cukup: riwayat waktu dan kondisi penyimpanan "${foodName}" sama-sama tidak diketahui sehingga tidak dapat dinilai.`
        : `Informasi belum cukup: penilaian "${foodName}" memerlukan kepastian durasi waktu dan kondisi suhu penyimpanan.`,
      timeStorageFactor:
        storageId === 'unknown'
          ? 'Riwayat suhu dan tempat penyimpanan belum diketahui.'
          : `Tempat penyimpanan tercatat (${storage.label}), namun durasi waktu simpan belum diketahui.`,
      sensoryFactor: sensoryUnknown
        ? 'Pengamatan bau, warna, dan tekstur belum dilakukan secara langsung.'
        : 'Tidak ada tanda kerusakan kasatmata yang dilaporkan, namun foto dan pengamatan indera bukan bukti tunggal bahwa makanan aman.',
      reasoning:
        'Bakteri patogen pada pangan dapat berkembang tanpa mengubah warna atau aroma makanan. Tanpa data waktu dan suhu, status keamanan tidak boleh diasumsikan aman.',
      recommendation:
        'Lengkapi data waktu masak/simpan dan kondisi suhu. Jika makanan dicurigai telah berada di suhu ruang lebih dari 4 jam tanpa pendinginan, sebaiknya tidak dikonsumsi.',
      wasteGuidance: null,
    }
  }

  // 3. Evaluasi faktor waktu & suhu penyimpanan sebagai penentu utama
  const warningRoomHours = strictRoomTempAlert
    ? category.roomLimitHours
    : category.roomMaxHours
  const isRoomStorage =
    storageId === 'room_covered' || storageId === 'room_open'

  if (isRoomStorage) {
    // Melewati batas aman suhu ruang -> Risiko terindikasi (walaupun foto/bau normal)
    if (
      parsedHours > category.roomMaxHours ||
      (storageId === 'room_open' && parsedHours > category.roomLimitHours)
    ) {
      return {
        status: 'Risiko terindikasi',
        summary: `"${foodName}" telah berada di suhu ruang selama ${parsedHours} jam, melewati batas waktu aman untuk kategori ${category.label.toLowerCase()}.`,
        timeStorageFactor: `Durasi ${parsedHours} jam pada ${storage.label} melampaui batas acuan keamanan suhu ruang (${category.roomLimitHours}–${category.roomMaxHours} jam).`,
        sensoryFactor: imagePreview
          ? 'Foto konteks visual terlampir dan tidak ada keluhan bau/tekstur, namun tampilan normal tidak membatalkan risiko dari riwayat waktu dan suhu.'
          : 'Tidak ada keluhan bau, warna, atau tekstur, namun hasil indera yang tampak normal tidak dapat menaikkan status yang berisiko karena faktor waktu.',
        reasoning:
          'Makanan yang berada terlalu lama di suhu ruang rentan terhadap pertumbuhan mikroorganisme meskipun belum menunjukkan perubahan aroma atau warna.',
        recommendation:
          'Disarankan untuk tidak mengonsumsi makanan ini. Ke depannya, simpan makanan matang atau mudah rusak ke dalam kulkas maksimal 2 jam setelah disajikan.',
        wasteGuidance: null,
      }
    }

    // Mendekati batas waktu suhu ruang -> Perlu perhatian
    if (parsedHours >= warningRoomHours || sensoryUnknown) {
      return {
        status: 'Perlu perhatian',
        summary: `"${foodName}" telah berada di suhu ruang selama ${parsedHours} jam dan mendekati batas waktu simpan suhu ruang.`,
        timeStorageFactor: `Tercatat ${parsedHours} jam pada ${storage.label} (ambang kewaspadaan suhu ruang: ${warningRoomHours} jam).`,
        sensoryFactor: sensoryUnknown
          ? 'Observasi bau dan tekstur belum dikonfirmasi sepenuhnya oleh pengguna.'
          : 'Tidak ditemukan perubahan bau, warna, atau tekstur pada pengamatan awal.',
        reasoning:
          'Durasi di suhu ruang sudah mendekati batas toleransi sehingga memerlukan tindakan segera sebelum risiko meningkat.',
        recommendation:
          'Apabila hendak dikonsumsi sekarang, panaskan kembali hingga panas merata dan periksa aromanya. Jangan dibiarkan lebih lama di suhu ruang dan tidak disarankan untuk didonasikan.',
        wasteGuidance:
          'Konsumsi segera setelah dipanaskan merata, atau pindahkan porsi yang belum tersentuh ke lemari pendingin bila durasi suhu ruang belum melewati 2 jam.',
      }
    }
  }

  // Evaluasi penyimpanan dingin (Kulkas)
  if (storageId === 'fridge' && parsedHours > category.fridgeLimitHours) {
    return {
      status: 'Risiko terindikasi',
      summary: `"${foodName}" telah disimpan di lemari pendingin selama ${parsedHours} jam, melewati acuan waktu simpan dingin (${category.fridgeLimitHours} jam).`,
      timeStorageFactor: `Durasi penyimpanan kulkas ${parsedHours} jam melebihi batas acuan ${category.fridgeLimitHours} jam untuk kategori ${category.label}.`,
      sensoryFactor:
        'Meskipun tampilan dan bau tampak normal, penyimpanan dingin yang melampaui batas waktu tetap berisiko.',
      reasoning:
        'Pendinginan di kulkas hanya memperlambat pertumbuhan mikroba, bukan menghentikannya tanpa batas waktu.',
      recommendation:
        'Sebaiknya tidak dikonsumsi. Gunakan label tanggal simpan pada wadah makanan di kulkas untuk mencegah penyimpanan berlebih.',
      wasteGuidance: null,
    }
  }

  // 4. Waktu & suhu sesuai, tetapi observasi indera belum dilakukan
  if (sensoryUnknown) {
    return {
      status: 'Perlu informasi tambahan',
      summary: `Informasi belum cukup: riwayat waktu (${parsedHours} jam) dan suhu (${storage.label}) masih sesuai acuan, namun pengamatan bau dan tekstur belum dikonfirmasi.`,
      timeStorageFactor: `Disimpan pada ${storage.label} selama ${parsedHours} jam (dalam rentang acuan kategori ${category.label}).`,
      sensoryFactor:
        'Pengguna menandai belum memeriksa bau, warna, dan tekstur makanan secara langsung.',
      reasoning:
        'Penilaian kondisi makanan memerlukan gabungan riwayat waktu/suhu yang baik dan konfirmasi bahwa tidak ada tanda pembusukan fisik.',
      recommendation:
        'Periksa aroma, tekstur permukaan, dan kondisi bagian dalam makanan sebelum memutuskan untuk memanaskan atau mengonsumsinya.',
      wasteGuidance: null,
    }
  }

  // 5. Waktu, suhu, dan observasi indera semuanya dalam batas wajar -> Status: "Perlu perhatian"
  // (Tidak pernah menggunakan klaim absolut "100% Aman")
  return {
    status: 'Perlu perhatian',
    summary: `Riwayat waktu (${parsedHours} jam) pada ${storage.label.toLowerCase()} masih berada dalam batas acuan untuk "${foodName}", tanpa indikasi perubahan bau, warna, atau tekstur.`,
    timeStorageFactor: `Tercatat ${parsedHours} jam pada ${storage.label} (acuan kategori: ${
      isRoomStorage
        ? `maks. ${category.roomLimitHours}–${category.roomMaxHours} jam suhu ruang`
        : `maks. ${category.fridgeLimitHours} jam suhu kulkas`
    }).`,
    sensoryFactor: imagePreview
      ? 'Foto konteks visual disertakan dan pengguna mengonfirmasi tidak ada perubahan bau, tekstur lendir, atau warna tidak wajar.'
      : 'Pengguna mengonfirmasi tidak ada perubahan bau, tekstur lendir, atau warna tidak wajar.',
    reasoning:
      'Riwayat penyimpanan dan pengamatan indera mendukung, namun pemeriksaan mandiri tidak dapat mendeteksi mikroorganisme tak kasatmata sehingga penanganan higienis tetap diperlukan.',
    recommendation:
      'Gunakan peralatan makan bersih. Untuk makanan matang atau makanan dari kulkas, panaskan kembali hingga panas merata sebelum dikonsumsi dan periksa aromanya.',
    wasteGuidance:
      notes && notes.trim().length > 0
        ? `Catatan ("${notes.trim()}") telah dicatat. Untuk mengurangi food waste secara bertanggung jawab, habiskan sesuai porsi. Jika ingin disalurkan ke penerima atau food bank, pastikan suhu penyimpanan tetap terjaga dan ingatkan penerima untuk tetap melakukan pemeriksaan kelayakan sendiri.`
        : 'Untuk mengurangi food waste secara bertanggung jawab, prioritaskan konsumsi tepat waktu atau beri label jam simpan. Bila ingin dibagikan, pastikan rantai suhu terjaga dan penerima/food bank tetap melakukan pemeriksaan mandiri sebelum konsumsi.',
  }
}
