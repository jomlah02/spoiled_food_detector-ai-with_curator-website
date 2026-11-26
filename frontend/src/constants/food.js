export const FOOD_CATEGORIES = [
  {
    id: 'cooked',
    label: 'Makanan Matang & Lauk Siap Saji',
    hint: 'Nasi, sup, olahan daging, ayam, ikan, tumisan sayur',
    roomLimitHours: 2,
    roomMaxHours: 4,
    fridgeLimitHours: 72,
  },
  {
    id: 'dairy_chilled',
    label: 'Susu, Olahan Dingin & Masakan Bersantan',
    hint: 'Susu cair, gulai/opor bersantan, keju lunak, puding susu',
    roomLimitHours: 2,
    roomMaxHours: 3,
    fridgeLimitHours: 48,
  },
  {
    id: 'produce_cut',
    label: 'Buah Kupas & Sayur Potong Segar',
    hint: 'Buah potong, salad sayur segar, lalapan siap santap',
    roomLimitHours: 2,
    roomMaxHours: 4,
    fridgeLimitHours: 48,
  },
  {
    id: 'bakery_dry',
    label: 'Roti, Kue & Makanan Kering',
    hint: 'Roti tawar, kue tanpa isian krim basah, makanan panggang',
    roomLimitHours: 24,
    roomMaxHours: 48,
    fridgeLimitHours: 120,
  },
]

export const STORAGE_OPTIONS = [
  {
    id: 'fridge',
    label: 'Lemari Pendingin / Kulkas (≤ 4°C)',
    desc: 'Disimpan tertutup di rak dingin kulkas',
  },
  {
    id: 'room_covered',
    label: 'Suhu Ruang — Wadah Tertutup',
    desc: 'Di meja makan atau dapur dengan penutup rapat',
  },
  {
    id: 'room_open',
    label: 'Suhu Ruang — Terbuka',
    desc: 'Tanpa penutup atau terpapar udara ruang langsung',
  },
  {
    id: 'freezer',
    label: 'Freezer Beku (≤ -18°C)',
    desc: 'Disimpan dalam kondisi beku secara konsisten',
  },
  {
    id: 'unknown',
    label: 'Tidak Diketahui / Ragu',
    desc: 'Riwayat tempat dan suhu penyimpanan tidak pasti',
  },
]

export const SENSORY_CHECKS = [
  {
    id: 'odorChange',
    label: 'Aroma asam, tengik, atau menyengat tidak wajar',
    detail: 'Bau berbeda jelas dari aroma normal makanan tersebut',
  },
  {
    id: 'textureChange',
    label: 'Permukaan berlendir, berbusa, atau berair tidak normal',
    detail: 'Tekstur terasa licin atau menggumpal saat diamati',
  },
  {
    id: 'colorMoldChange',
    label: 'Perubahan warna mencolok atau bercak menyerupai jamur',
    detail: 'Titik putih, hijau, keabu-abuan, atau warna kusam ekstrem',
  },
  {
    id: 'packagingSwollen',
    label: 'Wadah menggembung atau tutup terdorong gas',
    detail: 'Terdapat indikasi fermentasi atau gas di dalam wadah',
  },
]
