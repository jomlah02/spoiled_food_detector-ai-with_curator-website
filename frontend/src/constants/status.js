// Empat status hasil penilaian. Warnanya ada di theme (status.<id>, status.<id>.bg, status.<id>.fg).
export const STATUS = {
  OK: 'ok',
  CAUTION: 'caution',
  DANGER: 'danger',
  INFO: 'info',
}

export const STATUS_LABELS = {
  ok: 'Layak, dengan catatan',
  caution: 'Hati-hati',
  danger: 'Jangan dikonsumsi',
  info: 'Perlu info',
}

// Teks pendek untuk stempel
export const STATUS_STAMPS = {
  ok: 'Layak',
  caution: 'Hati-hati',
  danger: 'Jangan dimakan',
  info: 'Perlu info',
}

export const OUTCOMES = {
  eaten: 'Dimakan',
  shared: 'Dibagikan',
  tossed: 'Dibuang',
}
