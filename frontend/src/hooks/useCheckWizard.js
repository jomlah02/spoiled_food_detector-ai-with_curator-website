import { useState } from 'react'
import { isColdStorage } from '../constants/food'
import { analyzeFood, buildAnalyzePayload, getAnalysisView } from '../lib/api'
import { evaluateFood } from '../lib/evaluateFood'

// Sesi 1: pertanyaan yang dijawab sebelum analisa backend.
export const CHECK_STEPS = ['food', 'storage', 'time', 'extras']
// Sesi 2: hasil analisa awal + pertanyaan bau/tampilan.
export const SENSORY_STEP = CHECK_STEPS.length
export const RESULT_STEP = CHECK_STEPS.length + 1

const EMPTY_ANSWERS = {
  foodName: '',
  categoryId: 'cooked',
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

export function useCheckWizard({ profile, onSave }) {
  const [answers, setAnswers] = useState(EMPTY_ANSWERS)
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('form')
  const [analysis, setAnalysis] = useState(null)
  const [analysisNotice, setAnalysisNotice] = useState('')
  const [result, setResult] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const update = (patch) => setAnswers((prev) => ({ ...prev, ...patch }))
  const goTo = (index) => {
    setPhase(index >= RESULT_STEP ? 'result' : index >= SENSORY_STEP ? 'sensory' : 'form')
    setStep(index)
    window.scrollTo({ top: 0 })
  }
  const next = () => goTo(Math.min(step + 1, CHECK_STEPS.length - 1))
  const back = () => goTo(Math.max(step - 1, 0))

  // delay dikit biar pilihannya keliatan dulu
  const advance = (patch) => {
    if (patch) update(patch)
    setTimeout(() => {
      setPhase('form')
      setStep((s) => Math.min(s + 1, CHECK_STEPS.length - 1))
      window.scrollTo({ top: 0 })
    }, 180)
  }

  // Sesi 1 selesai -> kirim ke backend, lalu masuk Sesi 2.
  const submit = async () => {
    if (submitting) return
    setSubmitError('')
    setAnalysisNotice('')
    setSubmitting(true)
    try {
      const payload = buildAnalyzePayload({ answers, now: Date.now() })
      const response = await analyzeFood(payload)
      setAnalysis(response)
      goTo(SENSORY_STEP)
    } catch (error) {
      // Backend belum tersambung / endpoint belum siap: jangan bikin user
      // mentok di step terakhir. Hasil awal tetap bisa dihitung lokal.
      console.warn('Analisa backend gagal, memakai hasil lokal:', error)
      const now = Date.now()
      setAnalysis(localAnalysis(answers, profile, now))
      setAnalysisNotice('Backend analisa belum tersambung. Hasil awal dihitung dari jawabanmu.')
      goTo(SENSORY_STEP)
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
      outcome: null,
      closedAt: null,
      ...evaluation,
    }
    onSave(record)
    setResult(record)
    goTo(RESULT_STEP)
  }

  const reset = () => {
    setAnswers(EMPTY_ANSWERS)
    setAnalysis(null)
    setAnalysisNotice('')
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
    })
    setAnalysis(item)
    setAnalysisNotice('')
    setResult(null)
    setEditingId(item.id)
    setSubmitError('')
    setPhase('sensory')
    setStep(SENSORY_STEP)
  }

  const hasProgress = answers.foodName.trim().length > 0 || Boolean(answers.imagePreview) || step > 0

  return {
    answers,
    step,
    phase,
    stepName: phase === 'sensory' ? 'sensory' : CHECK_STEPS[step],
    isForm: phase === 'form',
    isSensory: phase === 'sensory',
    isResult: phase === 'result' && Boolean(result),
    result,
    analysis,
    analysisNotice,
    isRecheck: Boolean(editingId),
    hasProgress,
    submitting,
    submitError,
    totalSteps: phase === 'sensory' ? SENSORY_STEP + 1 : CHECK_STEPS.length,
    update,
    goTo,
    next,
    back,
    advance,
    submit,
    finish,
    reset,
    startRecheck,
  }
}
