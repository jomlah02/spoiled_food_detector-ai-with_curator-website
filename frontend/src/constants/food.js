// batas dalam jam, ngikutin aturan 2 jam (WHO / USDA)
export const FOOD_CATEGORIES = [
  {
    id: 'cooked',
    label: 'Makanan matang',
    hint: 'Nasi, lauk, sup, tumisan',
    roomLimitHours: 2,
    roomMaxHours: 4,
    fridgeLimitHours: 72,
    freezerLimitHours: 24 * 90,
  },
  {
    id: 'dairy_chilled',
    label: 'Bersantan & olahan susu',
    hint: 'Opor, gulai, susu, puding',
    roomLimitHours: 2,
    roomMaxHours: 3,
    fridgeLimitHours: 48,
    freezerLimitHours: 24 * 60,
  },
  {
    id: 'produce_cut',
    label: 'Buah & sayur potong',
    hint: 'Buah kupas, salad, lalapan',
    roomLimitHours: 2,
    roomMaxHours: 4,
    fridgeLimitHours: 48,
    freezerLimitHours: 24 * 90,
  },
  {
    id: 'bakery_dry',
    label: 'Roti, kue & makanan kering',
    hint: 'Roti, kue tanpa krim basah',
    roomLimitHours: 24,
    roomMaxHours: 48,
    fridgeLimitHours: 120,
    freezerLimitHours: 24 * 90,
  },
]

export const QUICK_FOODS = [
  { label: 'Nasi', categoryId: 'cooked' },
  { label: 'Ayam goreng', categoryId: 'cooked' },
  { label: 'Sayur sop', categoryId: 'cooked' },
  { label: 'Opor / gulai', categoryId: 'dairy_chilled' },
  { label: 'Rendang', categoryId: 'dairy_chilled' },
  { label: 'Susu', categoryId: 'dairy_chilled' },
  { label: 'Buah potong', categoryId: 'produce_cut' },
  { label: 'Salad', categoryId: 'produce_cut' },
  { label: 'Roti', categoryId: 'bakery_dry' },
  { label: 'Kue', categoryId: 'bakery_dry' },
]

const CATEGORY_KEYWORDS = {
  dairy_chilled: ['santan', 'opor', 'gulai', 'kari', 'kare', 'rendang', 'lodeh', 'susu', 'puding', 'keju', 'yogurt', 'es krim'],
  produce_cut: ['buah', 'salad', 'lalap', 'semangka', 'melon', 'pepaya', 'nanas', 'mangga', 'rujak', 'gado'],
  bakery_dry: ['roti', 'kue', 'biskuit', 'donat', 'bolu', 'cake', 'kerupuk', 'keripik'],
}

export function guessCategory(name) {
  const lower = name.toLowerCase()
  for (const [categoryId, words] of Object.entries(CATEGORY_KEYWORDS)) {
    if (words.some((word) => lower.includes(word))) return categoryId
  }
  return 'cooked'
}

export const STORAGE_OPTIONS = [
  { id: 'fridge', label: 'Kulkas', desc: 'Rak dingin, ≤ 4°C' },
  { id: 'freezer', label: 'Freezer', desc: 'Beku, ≤ -18°C' },
  { id: 'room_covered', label: 'Suhu ruang, tertutup', desc: 'Di meja, ada tutupnya' },
  { id: 'room_open', label: 'Suhu ruang, terbuka', desc: 'Di meja, tanpa tutup' },
  { id: 'unknown', label: 'Tidak tahu', desc: 'Tidak yakin disimpan di mana' },
]

export const isColdStorage = (storageId) =>
  storageId === 'fridge' || storageId === 'freezer'

export const PRE_ROOM_OPTIONS = [
  { id: 'under2', label: 'Kurang dari 2 jam', hours: 1 },
  { id: '2to4', label: '2–4 jam', hours: 3 },
  { id: 'over4', label: 'Lebih dari 4 jam', hours: 5 },
  { id: 'unknown', label: 'Tidak tahu', hours: null },
]

export const SENSORY_CHECKS = [
  { id: 'odorChange', label: 'Bau asam, tengik, atau menyengat' },
  { id: 'textureChange', label: 'Berlendir, berbusa, atau berair' },
  { id: 'colorMoldChange', label: 'Berjamur atau warnanya aneh' },
  { id: 'packagingSwollen', label: 'Wadah menggembung' },
]

export const getCategory = (id) =>
  FOOD_CATEGORIES.find((c) => c.id === id) || FOOD_CATEGORIES[0]
export const getStorage = (id) =>
  STORAGE_OPTIONS.find((s) => s.id === id) || STORAGE_OPTIONS[STORAGE_OPTIONS.length - 1]
export const getPreRoom = (id) => PRE_ROOM_OPTIONS.find((p) => p.id === id) || null
