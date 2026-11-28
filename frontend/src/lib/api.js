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

// ---------------------------------------------------------------------------
// Pertanyaan lanjutan dari AI (Sesi 2)
//
// Backend bisa mengirim pertanyaan dengan beberapa nama field yang umum
// dipakai. Normalizer ini membuat semuanya jadi bentuk yang sama supaya
// komponen dinamis tidak perlu tahu bentuk mentah responsnya.
// ---------------------------------------------------------------------------

const QUESTION_LIST_KEYS = [
  'pertanyaan_lanjutan',
  'pertanyaanLanjutan',
  'pertanyaan_lanjutan_ai',
  'follow_up_questions',
  'followUpQuestions',
  'followup_questions',
  'follow_up',
  'followUps',
  'dynamic_questions',
  'dynamicQuestions',
  'pertanyaan_dinamis',
  'pertanyaanDinamis',
  'additional_questions',
  'clarifying_questions',
  'questions',
  'pertanyaan',
  'tanya',
  'qa',
]

const QUESTION_TEXT_KEYS = [
  'pertanyaan',
  'question',
  'question_text',
  'teks_pertanyaan',
  'text',
  'prompt',
  'teks',
  'tanya',
  'title',
  'label',
  'q',
]
const QUESTION_OPTION_KEYS = [
  'pilihan',
  'options',
  'answer_options',
  'possible_answers',
  'answers',
  'jawaban',
  'choices',
  'opsi',
  'values',
]
const QUESTION_DESCRIPTION_KEYS = [
  'description',
  'deskripsi',
  'desc',
  'subtitle',
  'sub_judul',
  'hint',
  'keterangan',
  'detail',
]
const OPTION_DESCRIPTION_KEYS = [
  'description',
  'deskripsi',
  'desc',
  'sub_label',
  'subLabel',
  'sub_judul',
  'hint',
  'keterangan',
  'detail',
]

function parseMaybeJson(value) {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) return value
  try {
    return JSON.parse(trimmed)
  } catch {
    return value
  }
}

function isQuestionObject(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return false
  return (
    Boolean(firstString(item, QUESTION_TEXT_KEYS)) ||
    QUESTION_OPTION_KEYS.some((key) => Array.isArray(parseMaybeJson(item[key])))
  )
}

function isQuestionItem(item) {
  if (typeof item === 'string') return item.trim().length > 0
  return isQuestionObject(item)
}

// Backend bisa mengirim list langsung, atau membungkusnya dalam object
// (mis. { q1: {...}, q2: {...} }). Keduanya diterima.
function questionListFrom(value) {
  const parsed = parseMaybeJson(value)
  if (Array.isArray(parsed)) {
    return parsed.length > 0 && parsed.every(isQuestionItem) ? parsed : null
  }
  if (parsed && typeof parsed === 'object') {
    const items = Object.values(parsed)
    return items.length > 0 && items.every(isQuestionItem) ? items : null
  }
  return null
}

function findQuestionArray(node, depth = 0) {
  if (depth > 6 || node == null) return null

  const parsed = parseMaybeJson(node)
  if (parsed !== node) return findQuestionArray(parsed, depth + 1)

  if (Array.isArray(node)) {
    // Fallback tanpa nama field: hanya array of object yang dianggap
    // pertanyaan. Array string biasanya berisi tips/aksi, bukan pertanyaan.
    return node.length > 0 && node.every(isQuestionObject) ? node : null
  }

  if (typeof node !== 'object') return null

  for (const key of QUESTION_LIST_KEYS) {
    const found = questionListFrom(node[key])
    if (found) return found
  }

  for (const [key, value] of Object.entries(node)) {
    // Jangan telusuri daftar pilihan, nanti pilihan bisa disangka pertanyaan.
    if (QUESTION_OPTION_KEYS.includes(key)) continue
    const found = findQuestionArray(value, depth + 1)
    if (found) return found
  }

  return null
}

function firstString(source, keys) {
  for (const key of keys) {
    const value = source?.[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function normalizeQuestionType(value) {
  const type = String(value || '').toLowerCase()
  if (
    [
      'multiple',
      'multi',
      'checkbox',
      'checklist',
      'pilih_banyak',
      'banyak',
      'multi_select',
      'multiple_choice',
    ].includes(type)
  ) {
    return 'multiple'
  }
  if (['textarea', 'long_text', 'long-text', 'teks_panjang'].includes(type)) {
    return 'textarea'
  }
  if (
    ['text', 'input', 'isian', 'free_text', 'free-text', 'short_text', 'teks'].includes(type)
  ) {
    return 'text'
  }
  return 'single'
}

function optionsFromObject(rawOptions) {
  if (!rawOptions || typeof rawOptions !== 'object' || Array.isArray(rawOptions)) return null
  // { "Ya": "ya", "Tidak": "tidak" } atau { "ya": { label: "Ya" } }
  return Object.entries(rawOptions).map(([key, value]) =>
    value && typeof value === 'object' ? { id: key, ...value } : { id: key, label: value }
  )
}

function normalizeOptions(rawOptions) {
  const parsed = parseMaybeJson(rawOptions)
  const list = Array.isArray(parsed) ? parsed : optionsFromObject(parsed) || []
  const seen = new Set()

  return list
    .map((option, index) => {
      if (typeof option === 'string' || typeof option === 'number') {
        return { id: String(index + 1), label: String(option) }
      }
      if (!option || typeof option !== 'object') return null

      const label =
        firstString(option, ['label', 'text', 'jawaban', 'answer', 'value', 'name', 'opsi']) ||
        String(option.id ?? index + 1)
      const id = String(option.id ?? option.key ?? option.value ?? label)

      return {
        id,
        label,
        description: firstString(option, OPTION_DESCRIPTION_KEYS),
      }
    })
    .filter(Boolean)
    .filter((option) => {
      if (seen.has(option.id)) return false
      seen.add(option.id)
      return true
    })
}

export function extractFollowUpQuestions(analysis) {
  const rawList = findQuestionArray(analysis)
  if (!rawList) return []

  const usedIds = new Set()

  return rawList
    .map((item, index) => {
      if (typeof item === 'string') {
        return {
          id: `q-${index + 1}`,
          text: item.trim(),
          description: '',
          type: 'single',
          options: [],
        }
      }

      const rawId = item.id ?? item.key ?? item.question_id ?? item.questionId ?? item.code
      let id = String(rawId ?? `q-${index + 1}`)
      if (usedIds.has(id)) id = `${id}-${index + 1}`
      usedIds.add(id)

      const rawOptions =
        QUESTION_OPTION_KEYS.map((key) => parseMaybeJson(item[key])).find(
          (value) => Array.isArray(value) || (value && typeof value === 'object')
        ) || []
      const options = normalizeOptions(rawOptions)
      const type = normalizeQuestionType(
        item.type ?? item.tipe ?? item.mode ?? item.input_type ?? item.inputType
      )

      return {
        id,
        text: firstString(item, QUESTION_TEXT_KEYS) || `Pertanyaan ${index + 1}`,
        description: firstString(item, QUESTION_DESCRIPTION_KEYS),
        // Kalau tidak ada pilihan sama sekali, jatuh ke input teks.
        type: options.length === 0 ? 'text' : type,
        options,
      }
    })
    .filter((question) => question.text)
}

function answerLabel(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(answerLabel).filter(Boolean).join(', ')
  if (typeof value === 'object') return value.label ?? value.text ?? value.value ?? ''
  return String(value)
}

function answerId(value) {
  if (value == null) return null
  if (Array.isArray(value)) return value.map(answerId).filter(Boolean)
  if (typeof value === 'object') return value.id ?? value.value ?? null
  return null
}

// Bentuk jawaban lanjutan yang rapi dan siap dikirim kembali ke backend.
export function buildFollowUpAnswers(questions, followUps = {}) {
  return (questions || []).map((question) => {
    const value = followUps?.[question.id]
    return {
      id: question.id,
      pertanyaan: question.text,
      jawaban: answerLabel(value),
      jawaban_id: answerId(value),
    }
  })
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

const ANALYSIS_ROOT_KEYS = [
  'data',
  'result',
  'analysis',
  'hasil_analisis_awal',
  'hasilAnalisisAwal',
  'hasil_analisis',
  'hasilAnalisis',
  'hasil',
]

function unwrapAnalysis(analysis) {
  if (!analysis || typeof analysis !== 'object' || Array.isArray(analysis)) return {}
  for (const key of ANALYSIS_ROOT_KEYS) {
    const value = analysis[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return unwrapAnalysis(value)
    }
  }
  return analysis
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
    root.kondisi_visual ||
    root.kondisiVisual ||
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
