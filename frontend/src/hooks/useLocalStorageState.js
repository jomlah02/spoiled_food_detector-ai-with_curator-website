import { useState, useEffect } from 'react'

export function useLocalStorageState(key, fallback, parse = (value) => value) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = parse(JSON.parse(saved))
        if (parsed !== undefined) return parsed
      }
    } catch {
      // data rusak, pakai default aja
    }
    return fallback
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // kuota penuh, biarin
    }
  }, [key, value])

  return [value, setValue]
}
