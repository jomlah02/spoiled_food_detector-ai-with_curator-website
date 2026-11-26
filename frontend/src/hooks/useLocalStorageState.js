import { useState, useEffect } from 'react'

// useState yang otomatis dibaca dari dan disimpan ke localStorage.
// `parse` menerima nilai hasil JSON.parse dan mengembalikan nilai valid,
// atau undefined untuk memakai `fallback`.
export function useLocalStorageState(key, fallback, parse = (value) => value) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = parse(JSON.parse(saved))
        if (parsed !== undefined) return parsed
      }
    } catch {
      // Data rusak atau localStorage tidak tersedia: pakai nilai awal
    }
    return fallback
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Abaikan error kuota localStorage
    }
  }, [key, value])

  return [value, setValue]
}
