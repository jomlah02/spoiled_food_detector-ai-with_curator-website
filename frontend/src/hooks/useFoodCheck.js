import { useState, useEffect, useRef } from 'react'
import { FOOD_CATEGORIES, STORAGE_OPTIONS } from '../constants/food'
import { evaluateFoodCondition } from '../lib/evaluateFoodCondition'

// State & handler formulir pemeriksaan makanan.
// Disimpan di App agar isi formulir tidak hilang saat berpindah menu.
export function useFoodCheck({ profile, onRecordSaved }) {
  // State Form Pemeriksaan Makanan
  const [foodName, setFoodName] = useState('')
  const [categoryId, setCategoryId] = useState('cooked')
  const [durationKnown, setDurationKnown] = useState('known')
  const [durationHours, setDurationHours] = useState('')
  const [storageId, setStorageId] = useState('fridge')
  const [sensoryFlags, setSensoryFlags] = useState([])
  const [sensoryUnknown, setSensoryUnknown] = useState(false)
  const [notes, setNotes] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFileName, setImageFileName] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [isDraggingFile, setIsDraggingFile] = useState(false)

  // State Proses & Hasil
  const [formErrors, setFormErrors] = useState({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState(null)
  const [isResultSaved, setIsResultSaved] = useState(false)

  const analyzeTimerRef = useRef(null)
  const fileInputRef = useRef(null)
  const resultSectionRef = useRef(null)

  useEffect(() => {
    return () => {
      if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current)
    }
  }, [])

  // Handler Unggah Foto Makanan
  const handleFileProcess = (file) => {
    setUploadError('')
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setUploadError('Format file belum didukung. Gunakan gambar JPG, PNG, atau WEBP.')
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Ukuran file melebihi 4 MB. Pilih foto dengan ukuran lebih kecil.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
      setImageFileName(file.name)
    }
    reader.onerror = () => {
      setUploadError('Gagal memuat foto. Silakan pilih file gambar lain.')
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) handleFileProcess(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageFileName('')
    setUploadError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleToggleSensoryFlag = (flagId) => {
    setSensoryUnknown(false)
    setSensoryFlags((prev) =>
      prev.includes(flagId)
        ? prev.filter((item) => item !== flagId)
        : [...prev, flagId]
    )
  }

  const handleToggleSensoryUnknown = () => {
    setSensoryUnknown((prev) => {
      const next = !prev
      if (next) setSensoryFlags([])
      return next
    })
  }

  const handleRunAssessment = (e) => {
    e.preventDefault()
    const errors = {}

    if (!foodName.trim()) {
      errors.foodName = 'Nama atau jenis makanan wajib diisi terlebih dahulu.'
    }

    if (durationKnown === 'known') {
      if (durationHours === '' || Number.isNaN(Number(durationHours))) {
        errors.durationHours =
          'Isi perkiraan durasi simpan (jam), atau pilih "Tidak diketahui / ragu".'
      } else if (Number(durationHours) < 0 || Number(durationHours) > 720) {
        errors.durationHours = 'Masukkan angka durasi yang wajar (0–720 jam).'
      }
    }

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsAnalyzing(true)
    setIsResultSaved(false)

    if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current)
    analyzeTimerRef.current = setTimeout(() => {
      const cleanName = foodName.trim()
      const categoryObj =
        FOOD_CATEGORIES.find((c) => c.id === categoryId) || FOOD_CATEGORIES[0]
      const storageObj =
        STORAGE_OPTIONS.find((s) => s.id === storageId) || STORAGE_OPTIONS[0]

      const evaluated = evaluateFoodCondition({
        foodName: cleanName,
        categoryId,
        durationKnown,
        durationHours,
        storageId,
        sensoryFlags,
        sensoryUnknown,
        imagePreview,
        notes,
        strictRoomTempAlert: profile.strictRoomTempAlert,
      })

      const now = new Date()
      const formattedDate = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      const formattedTime = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })

      const newRecord = {
        id: `CUPI-${Math.floor(1000 + Math.random() * 9000)}`,
        isDemo: false,
        createdAt: `${formattedDate}, ${formattedTime}`,
        foodName: cleanName,
        categoryId,
        categoryLabel: categoryObj.label,
        durationHours: durationKnown === 'known' ? String(durationHours) : '',
        storageId,
        storageLabel: storageObj.label,
        sensoryFlags: [...sensoryFlags],
        sensoryUnknown,
        imagePreview,
        notes: notes.trim(),
        ...evaluated,
      }

      setAssessmentResult(newRecord)
      setIsAnalyzing(false)

      if (profile.autoSaveHistory) {
        onRecordSaved(newRecord)
        setIsResultSaved(true)
      }

      setTimeout(() => {
        if (resultSectionRef.current) {
          resultSectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }, 80)
    }, 420)
  }

  const handleSaveToHistoryManual = () => {
    if (!assessmentResult || isResultSaved) return
    onRecordSaved(assessmentResult)
    setIsResultSaved(true)
  }

  const handleResetForm = () => {
    setFoodName('')
    setCategoryId('cooked')
    setDurationKnown('known')
    setDurationHours('')
    setStorageId('fridge')
    setSensoryFlags([])
    setSensoryUnknown(false)
    setNotes('')
    handleRemoveImage()
    setFormErrors({})
    setAssessmentResult(null)
    setIsResultSaved(false)
  }

  const handleFillSampleInput = (sampleType) => {
    setFormErrors({})
    setAssessmentResult(null)
    setIsResultSaved(false)

    if (sampleType === 'room_risk') {
      setFoodName('Opor Ayam Santan')
      setCategoryId('dairy_chilled')
      setDurationKnown('known')
      setDurationHours('5.5')
      setStorageId('room_open')
      setSensoryFlags([])
      setSensoryUnknown(false)
      setNotes('Contoh uji: dibiarkan di suhu ruang sejak siang, tampilan masih terlihat biasa.')
    } else {
      setFoodName('Capcay Sayur Ayam')
      setCategoryId('cooked')
      setDurationKnown('known')
      setDurationHours('14')
      setStorageId('fridge')
      setSensoryFlags([])
      setSensoryUnknown(false)
      setNotes('Contoh uji: disimpan tertutup di lemari pendingin.')
    }
  }

  return {
    foodName,
    setFoodName,
    categoryId,
    setCategoryId,
    durationKnown,
    setDurationKnown,
    durationHours,
    setDurationHours,
    storageId,
    setStorageId,
    sensoryFlags,
    sensoryUnknown,
    notes,
    setNotes,
    imagePreview,
    imageFileName,
    uploadError,
    isDraggingFile,
    setIsDraggingFile,
    formErrors,
    setFormErrors,
    isAnalyzing,
    assessmentResult,
    isResultSaved,
    fileInputRef,
    resultSectionRef,
    handleFileProcess,
    handleFileInputChange,
    handleRemoveImage,
    handleToggleSensoryFlag,
    handleToggleSensoryUnknown,
    handleRunAssessment,
    handleSaveToHistoryManual,
    handleResetForm,
    handleFillSampleInput,
  }
}
