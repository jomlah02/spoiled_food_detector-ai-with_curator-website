import { useMemo } from 'react'
import { STORAGE_KEYS } from '../constants/storage'
import { useLocalStorageState } from './useLocalStorageState'

// "Kulkas saya": semua makanan yang sudah dicek.
// Item aktif = outcome null. Item selesai = dimakan / dibagikan / dibuang.
export function useKulkas() {
  const [items, setItems] = useLocalStorageState(STORAGE_KEYS.KULKAS, [], (parsed) =>
    Array.isArray(parsed) ? parsed : undefined
  )

  // Simpan hasil cek baru, atau timpa item lama saat "Cek ulang"
  const saveItem = (record) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === record.id)
      if (index === -1) return [record, ...prev]
      const next = [...prev]
      next[index] = { ...record, outcome: null, closedAt: null }
      return next
    })
  }

  const setOutcome = (id, outcome) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, outcome, closedAt: outcome ? Date.now() : null }
          : item
      )
    )
  }

  const deleteItem = (id) => setItems((prev) => prev.filter((item) => item.id !== id))
  const clearClosed = () => setItems((prev) => prev.filter((item) => !item.outcome))
  const clearAll = () => setItems([])

  const active = useMemo(() => items.filter((item) => !item.outcome), [items])
  const closed = useMemo(
    () =>
      items
        .filter((item) => item.outcome)
        .sort((a, b) => (b.closedAt || 0) - (a.closedAt || 0)),
    [items]
  )

  return {
    items,
    active,
    closed,
    saveItem,
    setOutcome,
    deleteItem,
    clearClosed,
    clearAll,
  }
}
