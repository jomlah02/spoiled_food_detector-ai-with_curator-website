import { useState } from 'react'
import { isColdStorage } from '../constants/food'
import { evaluateFood } from '../lib/evaluateFood'

export const CHECK_STEPS = ['food', 'sensory', 'time', 'storage', 'extras']
export const RESULT_STEP = CHECK_STEPS.length

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
  imagePreview: null,
  notes: '',
}

export function isStepAnswered(step, answers) {
  switch (step) {
    case 'food':
      return answers.foodName.trim().length > 0
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

export function useCheckWizard({ profile, onSave }) {
  const [answers, setAnswers] = useState(EMPTY_ANSWERS)
  const [step, setStep] = useState(0)
  const [result, setResult] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const update = (patch) => setAnswers((prev) => ({ ...prev, ...patch }))
  const goTo = (index) => {
    setStep(index)
    window.scrollTo({ top: 0 })
  }
  const next = () => goTo(Math.min(step + 1, CHECK_STEPS.length - 1))
  const back = () => goTo(Math.max(step - 1, 0))

  // delay dikit biar pilihannya keliatan dulu
  const advance = (patch) => {
    if (patch) update(patch)
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, CHECK_STEPS.length - 1))
      window.scrollTo({ top: 0 })
    }, 180)
  }

  const finish = () => {
    const now = Date.now()
    const trimmed = answers.foodName.trim()
    const foodName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
    const evaluation = evaluateFood({
      ...answers,
      foodName,
      strictRoomTempAlert: profile.strictRoomTempAlert,
      now,
    })
    const record = {
      id: editingId || makeId(),
      checkedAt: now,
      foodName,
      categoryId: answers.categoryId,
      sensory: answers.sensory,
      sensoryFlags: answers.sensoryFlags,
      cookedChoice: answers.cookedChoice,
      cookedAt: answers.cookedAt,
      storageId: answers.storageId,
      preRoom: answers.preRoom,
      imagePreview: answers.imagePreview,
      notes: answers.notes.trim(),
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
    setResult(null)
    setEditingId(null)
    setStep(0)
  }

  // jawaban lama dipakai lagi, cuma bau/tampilan yg dicek ulang
  const startRecheck = (item) => {
    setAnswers({
      ...EMPTY_ANSWERS,
      foodName: item.foodName,
      categoryId: item.categoryId,
      categoryTouched: true,
      cookedChoice: item.cookedChoice ?? (item.cookedAt ? 'custom' : 'unknown'),
      cookedAt: item.cookedAt,
      storageId: item.storageId,
      preRoom: item.preRoom,
      imagePreview: item.imagePreview,
      notes: item.notes || '',
    })
    setResult(null)
    setEditingId(item.id)
    setStep(1)
  }

  const hasProgress = answers.foodName.trim().length > 0 || step > 0

  return {
    answers,
    step,
    stepName: CHECK_STEPS[step],
    isResult: step === RESULT_STEP,
    result,
    isRecheck: Boolean(editingId),
    hasProgress,
    update,
    goTo,
    next,
    back,
    advance,
    finish,
    reset,
    startRecheck,
  }
}
