import { STATUS } from '../constants/status'

// Status yang ditampilkan sekarang: hasil cek, kecuali batas waktunya sudah lewat.
export function getLiveStatus(item, now) {
  const expired =
    item.deadline &&
    now > item.deadline &&
    (item.status === STATUS.OK || item.status === STATUS.CAUTION)
  return expired
    ? { status: STATUS.DANGER, label: 'Lewat batas waktu', expired: true }
    : { status: item.status, label: null, expired: false }
}

// Urutan di Kulkas saya: yang berbahaya dulu, lalu yang batas waktunya paling dekat.
export function sortByUrgency(items, now) {
  const rank = { danger: 0, caution: 1, info: 2, ok: 3 }
  return [...items].sort((a, b) => {
    const sa = getLiveStatus(a, now).status
    const sb = getLiveStatus(b, now).status
    if (rank[sa] !== rank[sb]) return rank[sa] - rank[sb]
    return (a.deadline ?? Infinity) - (b.deadline ?? Infinity)
  })
}
