import { useState, useEffect, useRef, useMemo } from 'react'
import { DEFAULT_PROFILE, STORAGE_KEYS } from '../constants/profile'
import { useLocalStorageState } from './useLocalStorageState'

// Profil pengguna lokal, preferensi, dan state formulir edit profil.
export function useProfile() {
  const [profile, setProfile] = useLocalStorageState(
    STORAGE_KEYS.PROFILE,
    DEFAULT_PROFILE,
    (parsed) =>
      parsed && typeof parsed === 'object'
        ? { ...DEFAULT_PROFILE, ...parsed }
        : undefined
  )

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileDraft, setProfileDraft] = useState(profile)
  const [profileFeedback, setProfileFeedback] = useState('')
  const [confirmClearHistory, setConfirmClearHistory] = useState(false)

  const feedbackTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    }
  }, [])

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const cleanName = profileDraft.displayName.trim() || 'Pengguna CuPI'
    const updated = {
      ...profileDraft,
      displayName: cleanName,
    }
    setProfile(updated)
    setProfileDraft(updated)
    setIsEditingProfile(false)
    setProfileFeedback('Perubahan profil lokal berhasil disimpan.')

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    feedbackTimerRef.current = setTimeout(() => {
      setProfileFeedback('')
    }, 3200)
  }

  const handlePreferenceToggle = (key) => {
    setProfile((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      setProfileDraft(updated)
      return updated
    })
  }

  const userInitials = useMemo(() => {
    const parts = (profile.displayName || 'CuPI').trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }, [profile.displayName])

  return {
    profile,
    isEditingProfile,
    setIsEditingProfile,
    profileDraft,
    setProfileDraft,
    profileFeedback,
    confirmClearHistory,
    setConfirmClearHistory,
    handleSaveProfile,
    handlePreferenceToggle,
    userInitials,
  }
}
