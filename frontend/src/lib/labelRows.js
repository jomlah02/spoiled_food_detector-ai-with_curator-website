import { getPreRoom, getStorage } from '../constants/food'
import { formatMoment, formatTimeLeft } from './time'

export function labelRowsFor(record, now) {
  const pre = getPreRoom(record.preRoom)
  const storage = record.storageId
    ? getStorage(record.storageId).label + (pre ? ` (${pre.label.toLowerCase()} di luar)` : '')
    : '—'
  const rows = [
    ['Masak', Number.isFinite(record.cookedAt) ? formatMoment(record.cookedAt, now) : 'tidak tahu'],
    ['Simpan', storage],
  ]
  if (record.deadline) {
    rows.push(['Batas', formatMoment(record.deadline, now)])
    rows.push(['Sisa', formatTimeLeft(record.deadline, now).replace(/^Sisa /, '')])
  }
  return rows
}
