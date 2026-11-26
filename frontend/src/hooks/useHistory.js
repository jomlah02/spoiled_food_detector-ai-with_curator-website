import { useState, useMemo } from 'react'
import { INITIAL_HISTORY_DEMO } from '../constants/demoHistory'
import { STORAGE_KEYS } from '../constants/profile'
import { useLocalStorageState } from './useLocalStorageState'

// Riwayat pemeriksaan (tersimpan lokal) beserta pencarian, filter, dan detail terbuka.
export function useHistory() {
  const [historyList, setHistoryList] = useLocalStorageState(
    STORAGE_KEYS.HISTORY,
    INITIAL_HISTORY_DEMO,
    (parsed) => (Array.isArray(parsed) ? parsed : undefined)
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [expandedHistoryId, setExpandedHistoryId] = useState('CUPI-DEMO-01')

  const filteredHistory = useMemo(() => {
    return historyList.filter((item) => {
      const matchQuery =
        !searchQuery.trim() ||
        item.foodName.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (item.categoryLabel &&
          item.categoryLabel.toLowerCase().includes(searchQuery.trim().toLowerCase()))

      const matchStatus =
        statusFilter === 'Semua' || item.status === statusFilter

      return matchQuery && matchStatus
    })
  }, [historyList, searchQuery, statusFilter])

  const addRecord = (record) => {
    setHistoryList((prev) => [record, ...prev])
    setExpandedHistoryId(record.id)
  }

  const handleDeleteHistoryItem = (id) => {
    setHistoryList((prev) => prev.filter((item) => item.id !== id))
    if (expandedHistoryId === id) {
      setExpandedHistoryId(null)
    }
  }

  return {
    historyList,
    setHistoryList,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    expandedHistoryId,
    setExpandedHistoryId,
    filteredHistory,
    addRecord,
    handleDeleteHistoryItem,
  }
}
