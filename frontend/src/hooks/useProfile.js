import { DEFAULT_PROFILE, STORAGE_KEYS } from '../constants/storage'
import { useLocalStorageState } from './useLocalStorageState'

export function useProfile() {
  const [profile, setProfile] = useLocalStorageState(
    STORAGE_KEYS.PROFILE,
    DEFAULT_PROFILE,
    (parsed) =>
      parsed && typeof parsed === 'object'
        ? { ...DEFAULT_PROFILE, ...parsed }
        : undefined
  )

  const updateProfile = (key, value) =>
    setProfile((prev) => ({ ...prev, [key]: value }))

  return { profile, updateProfile }
}
