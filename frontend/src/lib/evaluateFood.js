import {
  SENSORY_CHECKS,
  getCategory,
  getStorage,
  getPreRoom,
} from '../constants/food'
import { STATUS } from '../constants/status'
import { HOUR, formatDuration } from './time'

// Mesin penilaian CuPI.
// Prinsip: waktu & suhu adalah penentu utama. Bau/tampilan normal TIDAK BOLEH
// menaikkan status yang berisiko karena waktu/suhu. Tidak pernah mengklaim "100% aman".
export function evaluateFood({
  foodName,
  categoryId,
  cookedAt,
  storageId,
  preRoom,
  sensory,
  sensoryFlags = [],
  strictRoomTempAlert = true,
  now,
}) {
  const name = foodName?.trim() || 'Makanan ini'
  const category = getCategory(categoryId)
  const storage = getStorage(storageId)
  const pre = getPreRoom(preRoom)

  const sensoryFactor =
    sensory === 'normal'
      ? 'Kamu memastikan bau, warna, dan teksturnya normal. Tapi bakteri bisa tumbuh tanpa mengubah tampilan.'
      : sensory === 'unchecked'
        ? 'Bau, warna, dan tekstur belum dicek.'
        : ''

  // 1. Tanda fisik pembusukan: langsung jangan dikonsumsi
  if (sensory === 'flags' && sensoryFlags.length > 0) {
    const labels = SENSORY_CHECKS.filter((c) => sensoryFlags.includes(c.id)).map((c) =>
      c.label.toLowerCase()
    )
    return {
      status: STATUS.DANGER,
      headline: 'Jangan dimakan, jangan dicicipi',
      summary: `Ada tanda pembusukan pada ${name}: ${labels.join(', ')}.`,
      deadline: null,
      deadlineLabel: null,
      actions: [
        'Jangan dicicipi untuk "memastikan".',
        'Buang dalam wadah atau plastik tertutup.',
        'Cuci wadahnya dan cuci tangan setelahnya.',
      ],
      factors: {
        time: 'Tidak perlu dihitung, tanda fisiknya sudah cukup jelas.',
        sensory: `Kamu melaporkan: ${labels.join('; ')}.`,
      },
      reasoning:
        'Bau asam, lendir, jamur, atau wadah menggembung adalah tanda aktivitas mikroba. Memanaskan ulang tidak menghilangkan racun yang mungkin sudah terbentuk.',
      wasteGuidance: null,
    }
  }

  // 2. Data waktu atau tempat simpan belum ada
  const hasTime = Number.isFinite(cookedAt)
  if (!hasTime || storageId === 'unknown' || !storageId) {
    const both = !hasTime && (storageId === 'unknown' || !storageId)
    return {
      status: STATUS.INFO,
      headline: 'Belum bisa dinilai',
      summary: both
        ? `Waktu masak dan tempat simpan ${name} sama-sama belum diketahui.`
        : !hasTime
          ? `Waktu masak atau beli ${name} belum diketahui.`
          : `Tempat simpan ${name} belum diketahui.`,
      deadline: null,
      deadlineLabel: null,
      actions: [
        'Tanyakan jam masaknya ke orang yang menyiapkan makanan.',
        'Kalau mungkin sudah lebih dari 4 jam di suhu ruang, sebaiknya jangan dimakan.',
      ],
      factors: {
        time: hasTime
          ? `Dimasak atau dibeli sekitar ${formatDuration((now - cookedAt) / HOUR)} lalu.`
          : 'Waktu masak atau beli tidak diketahui.',
        sensory: sensoryFactor,
      },
      reasoning:
        'Bakteri penyebab sakit perut bisa berkembang tanpa mengubah bau atau warna. Tanpa tahu waktu dan suhu simpan, makanan tidak boleh dianggap aman.',
      wasteGuidance: null,
    }
  }

  const hours = Math.max(0, (now - cookedAt) / HOUR)
  const ago = formatDuration(hours)
  let result

  if (storageId === 'freezer' || storageId === 'fridge') {
    const isFreezer = storageId === 'freezer'
    const place = isFreezer ? 'freezer' : 'kulkas'
    const limit = isFreezer ? category.freezerLimitHours : category.fridgeLimitHours
    const preText = pre
      ? pre.id === 'unknown'
        ? ` Tidak diketahui berapa lama di suhu ruang sebelum masuk ${place}.`
        : ` Sebelumnya ${pre.label.toLowerCase()} di suhu ruang.`
      : ''
    const timeFactor = `Dimasak atau dibeli sekitar ${ago} lalu, lalu disimpan di ${place}.${preText}`

    if (pre?.id === 'over4') {
      result = {
        status: STATUS.DANGER,
        headline: `Terlalu lama di luar sebelum masuk ${place}`,
        summary: `${name} sempat lebih dari 4 jam di suhu ruang sebelum didinginkan.`,
        deadline: null,
        actions: [
          'Sebaiknya jangan dimakan, walaupun sekarang sudah dingin.',
          `Lain kali, masukkan ke ${place} paling lambat 2 jam setelah matang.`,
        ],
        reasoning: `Mendinginkan makanan tidak membunuh bakteri yang sudah berkembang selama di suhu ruang. Masuk ${place} setelah 4 jam itu sudah terlambat.`,
      }
    } else if (!isFreezer && hours > limit) {
      result = {
        status: STATUS.DANGER,
        headline: 'Sudah lewat batas simpan kulkas',
        summary: `${name} sudah ${ago} di kulkas, lebih dari batas ${formatDuration(limit)} untuk ${category.label.toLowerCase()}.`,
        deadline: cookedAt + limit * HOUR,
        actions: [
          'Sebaiknya jangan dimakan.',
          'Lain kali, beri label tanggal pada wadah di kulkas.',
        ],
        reasoning:
          'Kulkas hanya memperlambat pertumbuhan bakteri, tidak menghentikannya. Setelah beberapa hari risikonya naik walau tampilannya masih normal.',
      }
    } else if (isFreezer && hours > limit) {
      result = {
        status: STATUS.CAUTION,
        headline: 'Masih aman beku, tapi kualitasnya turun',
        summary: `${name} sudah ${ago} di freezer, lebih dari ${formatDuration(limit)}.`,
        deadline: null,
        actions: [
          'Cairkan di kulkas, bukan di meja.',
          'Rasa dan teksturnya mungkin sudah berubah. Cek setelah dicairkan.',
          'Panaskan sampai benar-benar panas.',
        ],
        reasoning:
          'Makanan yang terus beku pada -18°C tidak ditumbuhi bakteri, tapi rasa dan teksturnya menurun setelah beberapa bulan.',
      }
    } else {
      const nearLimit = !isFreezer && hours >= limit * 0.75
      const preUncertain = pre?.id === '2to4' || pre?.id === 'unknown'
      result = {
        status: nearLimit || preUncertain ? STATUS.CAUTION : STATUS.OK,
        headline: nearLimit
          ? 'Segera habiskan'
          : preUncertain
            ? 'Boleh, tapi lebih hati-hati'
            : `Masih dalam batas simpan ${place}`,
        summary: `${name} sudah ${ago} sejak dimasak, disimpan di ${place}.`,
        deadline: cookedAt + limit * HOUR,
        actions: isFreezer
          ? [
              'Cairkan di kulkas, bukan di meja.',
              'Panaskan sampai benar-benar panas, lalu habiskan.',
              'Jangan dibekukan lagi setelah dicairkan.',
            ]
          : [
              'Panaskan sampai mendidih atau benar-benar panas merata.',
              'Ambil secukupnya, sisanya langsung kembalikan ke kulkas.',
            ],
        reasoning: preUncertain
          ? `Waktu di ${place} masih dalam batas, tapi waktu di suhu ruang sebelumnya cukup lama atau tidak diketahui.`
          : `Waktu di ${place} masih dalam batas acuan untuk ${category.label.toLowerCase()}.`,
      }
    }
    result.factors = { time: timeFactor, sensory: sensoryFactor }
    result.deadlineLabel = 'Habiskan sebelum'
  } else {
    // Suhu ruang
    const isOpen = storageId === 'room_open'
    const strict = strictRoomTempAlert || isOpen
    const dangerAt = strict ? category.roomLimitHours : category.roomMaxHours
    const warnAt = strict ? dangerAt * 0.75 : category.roomLimitHours
    const timeFactor = `Dimasak atau dibeli sekitar ${ago} lalu, disimpan di ${storage.label.toLowerCase()}. Batas acuan: ${formatDuration(dangerAt)}.`

    if (hours > dangerAt) {
      result = {
        status: STATUS.DANGER,
        headline: 'Terlalu lama di suhu ruang',
        summary: `${name} sudah ${ago} di suhu ruang, lewat dari batas ${formatDuration(dangerAt)}.`,
        deadline: cookedAt + dangerAt * HOUR,
        actions: [
          'Sebaiknya jangan dimakan, walaupun terlihat dan tercium normal.',
          'Lain kali, masukkan ke kulkas paling lambat 2 jam setelah matang.',
        ],
        reasoning:
          'Di suhu ruang, bakteri berlipat ganda dengan cepat. Setelah lewat batas waktunya, memanaskan ulang belum tentu cukup.',
      }
    } else if (hours >= warnAt) {
      result = {
        status: STATUS.CAUTION,
        headline: 'Segera makan atau masukkan kulkas',
        summary: `${name} sudah ${ago} di suhu ruang dan hampir mencapai batas.`,
        deadline: cookedAt + dangerAt * HOUR,
        actions: [
          'Kalau mau dimakan sekarang, panaskan dulu sampai benar-benar panas.',
          'Kalau tidak, masukkan ke kulkas sekarang juga.',
          'Jangan dibagikan ke orang lain dalam kondisi ini.',
        ],
        reasoning:
          'Waktunya masih di dalam batas, tapi sudah dekat. Setiap jam tambahan di suhu ruang menaikkan risikonya.',
      }
    } else {
      result = {
        status: STATUS.OK,
        headline: 'Masih dalam batas waktu',
        summary: `${name} baru ${ago} di suhu ruang.`,
        deadline: cookedAt + warnAt * HOUR,
        actions: [
          'Habiskan atau masukkan ke kulkas sebelum batas waktunya.',
          'Simpan dalam wadah tertutup.',
        ],
        reasoning:
          'Waktunya masih jauh dari batas aman suhu ruang untuk kategori ini.',
      }
    }
    result.factors = { time: timeFactor, sensory: sensoryFactor }
    result.deadlineLabel =
      result.status === STATUS.OK ? 'Masukkan kulkas sebelum' : 'Batas waktu'
  }

  // Belum dicek bau & tampilan: status terbaik dibatasi "hati-hati"
  if (sensory === 'unchecked' && result.status === STATUS.OK) {
    result.status = STATUS.CAUTION
    result.headline = 'Cek bau dan tampilannya dulu'
    result.actions = [
      'Cium dan lihat dulu: bau asam, lendir, atau jamur berarti jangan dimakan.',
      ...result.actions,
    ]
  }

  result.wasteGuidance =
    result.status === STATUS.OK
      ? 'Biar tidak terbuang: beri label jam simpan di wadah, dan habiskan duluan yang paling lama. Kalau mau dibagikan, jaga tetap dingin di perjalanan dan beri tahu jam masaknya.'
      : result.status === STATUS.CAUTION
        ? 'Prioritaskan untuk dihabiskan hari ini. Porsi yang belum disentuh bisa langsung masuk kulkas.'
        : null

  return result
}
