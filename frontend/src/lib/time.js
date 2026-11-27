export const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

const timeFmt = (ms) =>
  new Date(ms).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

const startOfDay = (ms) => {
  const d = new Date(ms)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function formatDuration(hours) {
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} menit`
  if (hours < 10) return `${String(Math.round(hours * 2) / 2).replace('.', ',')} jam`
  if (hours < 48) return `${Math.round(hours)} jam`
  return `${Math.round(hours / 24)} hari`
}

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

export const COOKED_TIME_LABELS = {
  just_now: 'Baru saja',
  today_morning: 'Tadi pagi',
  today_noon: 'Tadi siang',
  today_evening: 'Tadi sore',
  yesterday_noon: 'Kemarin siang',
  yesterday_evening: 'Kemarin malam',
  two_days: '2 hari lalu',
  custom: 'Tahu jam pastinya',
  given: 'Pemberian',
}

export function getCookedTimeOptions(now) {
  const today = startOfDay(now)
  const at = (dayOffset, hour) => today + dayOffset * DAY + hour * HOUR
  const options = [
    { id: 'just_now', value: now - 0.5 * HOUR },
    { id: 'today_morning', value: at(0, 7) },
    { id: 'today_noon', value: at(0, 12) },
    { id: 'today_evening', value: at(0, 17) },
    { id: 'yesterday_noon', value: at(-1, 12) },
    { id: 'yesterday_evening', value: at(-1, 19) },
    { id: 'two_days', value: at(-2, 12) },
  ].map((option) => ({ ...option, label: COOKED_TIME_LABELS[option.id] }))
  // jam yg belum lewat ga usah muncul
  return options.filter((o) => o.id === 'just_now' || o.value < now - HOUR)
}

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
