import { useState } from 'react'
import { isColdStorage } from '../constants/food'
import {
  analyzeFood,
  buildAnalyzePayload,
  buildFollowUpAnswers,
  extractFollowUpQuestions,
  getAnalysisView,
} from '../lib/api'
import { evaluateFood } from '../lib/evaluateFood'

// Sesi 1: pertanyaan yang dijawab sebelum analisa backend.
export const CHECK_STEPS = ['food', 'storage', 'time', 'extras']
// Sesi 2: hasil analisa awal + pertanyaan lanjutan dari AI + cek bau/tampilan.
export const SENSORY_STEP = CHECK_STEPS.length

const EMPTY_ANSWERS = {
  foodName: '',
  // JENIS boleh kosong. User memilih sendiri kalau mau.
  categoryId: null,
  categoryTouched: false,
  sensory: null,
  sensoryFlags: [],
  cookedChoice: null,
  cookedAt: null,
  storageId: null,
  preRoom: null,
  photoFile: null,
  imagePreview: null,
  notes: '',
  // Jawaban pertanyaan lanjutan AI: { [questionId]: jawaban }
  followUps: {},
}

export function isStepAnswered(step, answers) {
  switch (step) {
    case 'food':
      return answers.foodName.trim().length > 0 || Boolean(answers.imagePreview)
    case 'sensory':
      if (answers.sensory === 'flags') return answers.sensoryFlags.length > 0
      return answers.sensory !== null
    case 'time':
      return answers.cookedChoice !== null
    case 'storage':
      if (!answers.storageId) return false
      return !isColdStorage(answers.storageId) || !!answers.preRoom
    default:
      return false
  }
}

const makeId = () =>
  `CUPI-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`

function localAnalysis(answers, profile, now) {
  const trimmed = answers.foodName.trim()
  const foodName = trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : 'Makanan ini'
  const evaluation = evaluateFood({
    ...answers,
    foodName,
    strictRoomTempAlert: profile.strictRoomTempAlert,
    now,
  })
  return {
    status: evaluation.status,
    headline: evaluation.headline,
    summary: evaluation.summary,
    food_name: foodName,
    source: 'local',
  }
}

const scrollTop = () => window.scrollTo({ top: 0 })

export function useCheckWizard({ profile, onSave }) {
  const [answers, setAnswers] = useState(EMPTY_ANSWERS)
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('form')
  const [analysis, setAnalysis] = useState(null)
  const [analysisNotice, setAnalysisNotice] = useState('')
  const [questions, setQuestions] = useState([])
  const [dynamicIndex, setDynamicIndex] = useState(0)
  const [result, setResult] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const update = (patch) => setAnswers((prev) => ({ ...prev, ...patch }))

  // Simpan jawaban satu pertanyaan lanjutan tanpa mengganggu jawaban lain.
  const setFollowUp = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      followUps: { ...prev.followUps, [questionId]: value },
    }))
  }

  const goTo = (index) => {
    scrollTop()
    if (index < CHECK_STEPS.length) {
      setPhase('form')
      setStep(Math.max(0, index))
      return
    }
    if (questions.length && index < CHECK_STEPS.length + questions.length) {
      setPhase('dynamic')
      setDynamicIndex(index - CHECK_STEPS.length)
      return
    }
    setPhase('sensory')
    setStep(SENSORY_STEP)
  }

  const next = () => goTo(Math.min(step + 1, CHECK_STEPS.length - 1))

  const back = () => {
    if (phase === 'dynamic') {
      if (dynamicIndex > 0) {
        setDynamicIndex(dynamicIndex - 1)
        scrollTop()
      } else {
        goTo(CHECK_STEPS.length - 1)
      }
      return
    }
    if (phase === 'sensory') {
      if (questions.length > 0) {
        setPhase('dynamic')
        setDynamicIndex(questions.length - 1)
        scrollTop()
      } else {
        goTo(CHECK_STEPS.length - 1)
      }
      return
    }
    goTo(Math.max(step - 1, 0))
  }

  // delay dikit biar pilihannya keliatan dulu
  const advance = (patch) => {
    if (patch) update(patch)
    setTimeout(() => {
      setPhase('form')
      setStep((s) => Math.min(s + 1, CHECK_STEPS.length - 1))
      scrollTop()
    }, 180)
  }

  // Pindah ke pertanyaan lanjutan berikutnya, atau ke cek bau/tampilan.
  const advanceDynamic = () => {
    setTimeout(() => {
      if (dynamicIndex + 1 < questions.length) {
        setDynamicIndex(dynamicIndex + 1)
      } else {
        setPhase('sensory')
        setStep(SENSORY_STEP)
      }
      scrollTop()
    }, 180)
  }

  // Sesi 1 selesai -> kirim ke backend, lalu render Sesi 2.
  const submit = async () => {
    if (submitting) return
    setSubmitError('')
    setAnalysisNotice('')
    setSubmitting(true)
    try {
      const payload = buildAnalyzePayload({ answers, now: Date.now() })
      const response = await analyzeFood(payload)
      const followUpQuestions = extractFollowUpQuestions(response)
      setAnalysis(response)
      setQuestions(followUpQuestions)
      setDynamicIndex(0)
      setStep(SENSORY_STEP)
      // Analisa baru = jawaban lanjutan lama tidak relevan lagi.
      setAnswers((prev) => ({ ...prev, followUps: {} }))
      scrollTop()
      setPhase(followUpQuestions.length > 0 ? 'dynamic' : 'sensory')
    } catch (error) {
      // Backend belum tersambung / endpoint belum siap: jangan bikin user
      // mentok di step terakhir. Hasil awal tetap bisa dihitung lokal.
      console.warn('Analisa backend gagal, memakai hasil lokal:', error)
      const now = Date.now()
      setAnalysis(localAnalysis(answers, profile, now))
      setAnalysisNotice('Backend analisa belum tersambung. Hasil awal dihitung dari jawabanmu.')
      setQuestions([])
      setDynamicIndex(0)
      setStep(SENSORY_STEP)
      setAnswers((prev) => ({ ...prev, followUps: {} }))
      scrollTop()
      setPhase('sensory')
    } finally {
      setSubmitting(false)
    }
  }

  // Sesi 2 selesai -> simpan hasil akhir.
  const finish = (patch) => {
    const now = Date.now()
    const finalAnswers = patch ? { ...answers, ...patch } : answers
    const view = getAnalysisView(analysis, finalAnswers.foodName)
    const trimmed = (finalAnswers.foodName || view.foodName || '').trim()
    const foodName = trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : 'Makanan ini'
    const evaluation = evaluateFood({
      ...finalAnswers,
      foodName,
      strictRoomTempAlert: profile.strictRoomTempAlert,
      now,
    })
    const record = {
      id: editingId || makeId(),
      checkedAt: now,
      foodName,
      categoryId: finalAnswers.categoryId,
      sensory: finalAnswers.sensory,
      sensoryFlags: finalAnswers.sensoryFlags,
      cookedChoice: finalAnswers.cookedChoice,
      cookedAt: finalAnswers.cookedAt,
      storageId: finalAnswers.storageId,
      preRoom: finalAnswers.preRoom,
      imagePreview: finalAnswers.imagePreview,
      notes: finalAnswers.notes.trim(),
      // Simpan jawaban pertanyaan lanjutan dalam bentuk siap kirim ke backend.
      followUps: finalAnswers.followUps,
      followUpAnswers: buildFollowUpAnswers(questions, finalAnswers.followUps),
      analysis,
      outcome: null,
      closedAt: null,
      ...evaluation,
    }
    onSave(record)
    setResult(record)
    setPhase('result')
    scrollTop()
  }

  const reset = () => {
    setAnswers(EMPTY_ANSWERS)
    setAnalysis(null)
    setAnalysisNotice('')
    setQuestions([])
    setDynamicIndex(0)
    setResult(null)
    setEditingId(null)
    setSubmitError('')
    setSubmitting(false)
    setPhase('form')
    setStep(0)
  }

  // jawaban lama dipakai lagi, cuma bau/tampilan yg dicek ulang
  const startRecheck = (item) => {
    setAnswers({
      ...EMPTY_ANSWERS,
      foodName: item.foodName,
      categoryId: item.categoryId,
      categoryTouched: true,
      cookedChoice: item.cookedChoice ?? (item.cookedAt ? 'custom' : 'given'),
      cookedAt: item.cookedAt,
      storageId: item.storageId,
      preRoom: item.preRoom,
      imagePreview: item.imagePreview,
      notes: item.notes || '',
      followUps: item.followUps || {},
    })
    setAnalysis(item)
    setAnalysisNotice('')
    setQuestions([])
    setDynamicIndex(0)
    setResult(null)
    setEditingId(item.id)
    setSubmitError('')
    setPhase('sensory')
    setStep(SENSORY_STEP)
  }

  const hasProgress =
    answers.foodName.trim().length > 0 ||
    Boolean(answers.imagePreview) ||
    step > 0 ||
    phase !== 'form'

  const currentStepIndex =
    phase === 'dynamic'
      ? CHECK_STEPS.length + dynamicIndex
      : phase === 'sensory'
        ? CHECK_STEPS.length + questions.length
        : step

  return {
    answers,
    step,
    phase,
    stepName: phase === 'dynamic' ? 'dynamic' : phase === 'sensory' ? 'sensory' : CHECK_STEPS[step],
    isForm: phase === 'form',
    isDynamic: phase === 'dynamic',
    isSensory: phase === 'sensory',
    isResult: phase === 'result' && Boolean(result),
    result,
    analysis,
    analysisNotice,
    questions,
    dynamicIndex,
    dynamicQuestion: questions[dynamicIndex] || null,
    isRecheck: Boolean(editingId),
    hasProgress,
    submitting,
    submitError,
    currentStepIndex,
    totalSteps: CHECK_STEPS.length + questions.length + 1,
    update,
    setFollowUp,
    goTo,
    next,
    back,
    advance,
    advanceDynamic,
    submit,
    finish,
    reset,
    startRecheck,
  }
}
