export const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

const timeFmt = (ms) =>
  new Date(ms).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

const startOfDay = (ms) => {
  const d = new Date(ms)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

// "45 menit", "3,5 jam", "2 hari"
export function formatDuration(hours) {
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} menit`
  if (hours < 10) return `${String(Math.round(hours * 2) / 2).replace('.', ',')} jam`
  if (hours < 48) return `${Math.round(hours)} jam`
  return `${Math.round(hours / 24)} hari`
}

// "hari ini 19.00", "besok 07.00", "Kam, 28 Nov 19.00"
export function formatMoment(ms, now) {
  const dayDiff = Math.round((startOfDay(ms) - startOfDay(now)) / DAY)
  if (dayDiff === 0) return `hari ini ${timeFmt(ms)}`
  if (dayDiff === 1) return `besok ${timeFmt(ms)}`
  if (dayDiff === -1) return `kemarin ${timeFmt(ms)}`
  const date = new Date(ms).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  return `${date} ${timeFmt(ms)}`
}

// "Sisa 3 jam" / "Lewat 2 jam"
export function formatTimeLeft(deadline, now) {
  const hours = (deadline - now) / HOUR
  if (hours <= 0) return `Lewat ${formatDuration(-hours)}`
  return `Sisa ${formatDuration(hours)}`
}

export function formatAgo(ms, now) {
  const hours = (now - ms) / HOUR
  if (hours < 1 / 60) return 'baru saja'
  return `${formatDuration(hours)} lalu`
}

// Pilihan cepat "kapan dimasak", hanya yang sudah lewat.
export function getCookedTimeOptions(now) {
  const today = startOfDay(now)
  const at = (dayOffset, hour) => today + dayOffset * DAY + hour * HOUR
  const options = [
    { id: 'just_now', label: 'Baru saja', value: now - 0.5 * HOUR },
    { id: 'today_morning', label: 'Tadi pagi', value: at(0, 7) },
    { id: 'today_noon', label: 'Tadi siang', value: at(0, 12) },
    { id: 'today_evening', label: 'Tadi sore', value: at(0, 17) },
    { id: 'yesterday_noon', label: 'Kemarin siang', value: at(-1, 12) },
    { id: 'yesterday_evening', label: 'Kemarin malam', value: at(-1, 19) },
    { id: 'two_days', label: '2 hari lalu', value: at(-2, 12) },
  ]
  // Opsi "hari ini" hanya muncul kalau jamnya sudah lewat minimal 1 jam
  return options.filter((o) => o.id === 'just_now' || o.value < now - HOUR)
}

// Untuk <input type="datetime-local">
export function toLocalInputValue(ms) {
  const d = new Date(ms)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const startOfMonth = (ms) => {
  const d = new Date(ms)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}
