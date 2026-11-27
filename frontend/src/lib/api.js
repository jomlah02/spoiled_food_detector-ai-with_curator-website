import { getPreRoom, getStorage } from '../constants/food'
import { COOKED_TIME_LABELS, formatAgo, toLocalInputValue } from './time'

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const ANALYZE_PATH = import.meta.env.VITE_ANALYZE_PATH || '/api/analyze'

function dataUrlToBlob(dataUrl) {
  const [meta, payload] = dataUrl.split(',')
  const mime = /data:([^;]+)/.exec(meta)?.[1] || 'image/jpeg'
  const binary = atob(payload)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

function appendPhoto(data, answers) {
  if (answers.photoFile) {
    const name = answers.photoFile.name || 'makanan.jpg'
    data.append('foto', answers.photoFile, name)
    return
  }
  if (!answers.imagePreview) return
  if (answers.imagePreview.startsWith('data:')) {
    data.append('foto', dataUrlToBlob(answers.imagePreview), 'makanan.jpg')
    return
  }
  // URL foto lama (misalnya saat cek ulang)
  data.append('foto', answers.imagePreview)
}

function cookedTimeLabel(choice) {
  return COOKED_TIME_LABELS[choice] || ''
}

function cookedTimeDetail(answers, now) {
  if (answers.cookedChoice === 'given') return ''
  if (answers.cookedChoice === 'custom') {
    return Number.isFinite(answers.cookedAt) ? toLocalInputValue(answers.cookedAt) : ''
  }
  return Number.isFinite(answers.cookedAt) ? formatAgo(answers.cookedAt, now) : ''
}

function buildFields(answers, now) {
  const storage = answers.storageId ? getStorage(answers.storageId) : null
  const preRoom = answers.preRoom ? getPreRoom(answers.preRoom) : null

  return {
    nama: answers.foodName.trim(),
    suhu_tempat: storage?.label || '',
    suhu_spesifik: preRoom?.label || '',
    waktu: cookedTimeLabel(answers.cookedChoice),
    waktu_spesifik: cookedTimeDetail(answers, now),
    detail_tambahan: answers.notes.trim(),
  }
}

export function buildAnalyzePayload({ answers, now = Date.now() }) {
  const fields = buildFields(answers, now)
  const hasPhoto = Boolean(answers.photoFile || answers.imagePreview)

  // Tanpa file binary, kirim JSON supaya `foto` tetap ada sebagai null/base64.
  if (!hasPhoto) {
    return {
      body: JSON.stringify({ foto: null, ...fields }),
      headers: { 'Content-Type': 'application/json' },
    }
  }

  if (answers.imagePreview && !answers.photoFile && !answers.imagePreview.startsWith('data:')) {
    // URL foto lama (misalnya saat cek ulang)
    return {
      body: JSON.stringify({ foto: answers.imagePreview, ...fields }),
      headers: { 'Content-Type': 'application/json' },
    }
  }

  const data = new FormData()
  appendPhoto(data, answers)
  for (const [key, value] of Object.entries(fields)) data.append(key, value)

  return { body: data, headers: {} }
}

export async function analyzeFood({ body: requestBody, headers = {} }) {
  const response = await fetch(`${API_BASE}${ANALYZE_PATH}`, {
    method: 'POST',
    body: requestBody,
    headers: { Accept: 'application/json', ...headers },
  })

  const text = await response.text()
  let parsed
  try {
    parsed = text ? JSON.parse(text) : null
  } catch {
    parsed = text
  }

  if (!response.ok) {
    const message =
      parsed?.message ||
      parsed?.detail ||
      parsed?.error ||
      `Analisa gagal (${response.status}). Coba lagi sebentar.`
    throw new Error(typeof message === 'string' ? message : 'Analisa gagal. Coba lagi sebentar.')
  }

  return parsed
}

const STATUS_ALIASES = {
  ok: 'ok',
  fresh: 'ok',
  aman: 'ok',
  layak: 'ok',
  caution: 'caution',
  warning: 'caution',
  warn: 'caution',
  'hati-hati': 'caution',
  danger: 'danger',
  spoiled: 'danger',
  busuk: 'danger',
  bahaya: 'danger',
  info: 'info',
  unknown: 'info',
}

function normalizeStatus(value) {
  if (!value) return null
  return STATUS_ALIASES[String(value).toLowerCase()] || null
}

function unwrapAnalysis(analysis) {
  if (!analysis || typeof analysis !== 'object') return {}
  return analysis.data || analysis.result || analysis.analysis || analysis
}

export function getAnalysisView(analysis, fallbackName = '') {
  const root = unwrapAnalysis(analysis)
  const status = normalizeStatus(
    root.status || root.condition || root.status_label || root.label
  )
  const headline =
    root.headline ||
    root.title ||
    root.kesimpulan ||
    root.prediction ||
    root.prediction_label ||
    root.kondisi ||
    root.label ||
    'Hasil analisa awal'
  const summary =
    root.summary ||
    root.message ||
    root.description ||
    root.analisa ||
    root.explanation ||
    root.reasoning ||
    root.recommendation ||
    (typeof analysis === 'string' ? analysis : '')
  const foodName =
    root.nama_makanan ||
    root.food_name ||
    root.nama ||
    root.food ||
    root.detected_food ||
    fallbackName

  return { status, headline, summary, foodName }
}
