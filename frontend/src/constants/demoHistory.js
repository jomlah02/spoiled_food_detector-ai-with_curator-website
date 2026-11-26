// Data contoh awal yang diberi label eksplisit "Contoh data (Mode demo)"
export const INITIAL_HISTORY_DEMO = [
  {
    id: 'CUPI-DEMO-01',
    isDemo: true,
    createdAt: '24 Nov 2026, 18:20',
    foodName: 'Ayam Gulai Santan Rumahan',
    categoryId: 'dairy_chilled',
    categoryLabel: 'Susu, Olahan Dingin & Masakan Bersantan',
    durationHours: '5',
    storageId: 'room_covered',
    storageLabel: 'Suhu Ruang — Wadah Tertutup',
    sensoryFlags: ['odorChange'],
    sensoryUnknown: false,
    imagePreview: null,
    notes: 'Contoh skenario: sisa makan siang disimpan di meja makan sejak pukul 13.00.',
    status: 'Risiko terindikasi',
    summary:
      'Makanan bersantan telah berada di suhu ruang selama 5 jam (melebihi batas acuan 2–3 jam) disertai perubahan aroma.',
    timeStorageFactor:
      'Penyimpanan suhu ruang selama 5 jam pada masakan bersantan melewati batas waktu aman di suhu ruang.',
    sensoryFactor:
      'Dilaporkan aroma asam/tidak wajar yang memperkuat indikasi penurunan mutu makanan.',
    reasoning:
      'Faktor durasi waktu di suhu ruang telah melampaui batas keamanan pangan, ditambah adanya tanda perubahan bau.',
    recommendation:
      'Disarankan untuk tidak mengonsumsi makanan ini. Pisahkan ke wadah sampah organik tertutup dan jangan dibagikan.',
    wasteGuidance: null,
  },
  {
    id: 'CUPI-DEMO-02',
    isDemo: true,
    createdAt: '24 Nov 2026, 12:40',
    foodName: 'Sup Ayam Sayur Bening',
    categoryId: 'cooked',
    categoryLabel: 'Makanan Matang & Lauk Siap Saji',
    durationHours: '16',
    storageId: 'fridge',
    storageLabel: 'Lemari Pendingin / Kulkas (≤ 4°C)',
    sensoryFlags: [],
    sensoryUnknown: false,
    imagePreview: null,
    notes: 'Contoh skenario: disimpan di wadah kedap udara di dalam kulkas setelah uap panas hilang.',
    status: 'Perlu perhatian',
    summary:
      'Riwayat penyimpanan dingin (16 jam di kulkas) masih berada dalam rentang acuan, tanpa keluhan bau, warna, atau tekstur.',
    timeStorageFactor:
      'Disimpan di lemari pendingin (≤ 4°C) selama 16 jam (masih di bawah batas acuan 72 jam untuk makanan matang).',
    sensoryFactor:
      'Tidak ditemukan perubahan aroma, tekstur berlendir, atau perubahan warna pada pengamatan pengguna.',
    reasoning:
      'Kondisi waktu dan suhu penyimpanan mendukung, namun pemeriksaan visual dan indera tidak menggantikan uji laboratorium.',
    recommendation:
      'Panaskan kembali secara merata hingga mendidih sebelum disajikan, dan pastikan aromanya tetap normal saat dipanaskan.',
    wasteGuidance:
      'Prioritaskan untuk dikonsumsi hari ini agar tidak terbuang. Bila ingin dibagikan ke pihak lain/komunitas, jaga suhu dingin selama perjalanan dan informasikan waktu masak agar penerima dapat memeriksa ulang.',
  },
  {
    id: 'CUPI-DEMO-03',
    isDemo: true,
    createdAt: '23 Nov 2026, 20:15',
    foodName: 'Nasi Kotak Acara Sore',
    categoryId: 'cooked',
    categoryLabel: 'Makanan Matang & Lauk Siap Saji',
    durationHours: '',
    storageId: 'unknown',
    storageLabel: 'Tidak Diketahui / Ragu',
    sensoryFlags: [],
    sensoryUnknown: true,
    imagePreview: null,
    notes: 'Contoh skenario: dibawa pulang dari acara tanpa label jam masak pada kemasan.',
    status: 'Perlu informasi tambahan',
    summary:
      'Informasi belum cukup: waktu masak dan riwayat penyimpanan sebelum makanan diterima belum diketahui.',
    timeStorageFactor:
      'Durasi paparan suhu ruang dan kondisi penyimpanan sebelumnya belum dapat dipastikan.',
    sensoryFactor:
      'Pengamatan bau dan tekstur belum dikonfirmasi; tampilan fisik yang tampak normal tidak menjamin makanan bebas risiko.',
    reasoning:
      'Keamanan pangan bergantung pada kepastian waktu dan suhu. Tanpa kedua data tersebut, kelayakan tidak dapat disimpulkan hanya dari tampilan luar.',
    recommendation:
      'Pastikan jam masak kepada penyedia makanan. Apabila makanan diperkirakan sudah berada di suhu ruang lebih dari 4 jam, hindari konsumsi.',
    wasteGuidance: null,
  },
]
