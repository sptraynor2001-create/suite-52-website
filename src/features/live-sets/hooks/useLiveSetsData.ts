/**
 * Custom hooks for live sets feature data management
 */

import { useState, useMemo } from 'react'
import { useApi } from '@/shared/hooks'
import { sortLiveSetsByDate, filterLiveSets, groupLiveSetsByYear, LiveSet } from '../services/liveSetsService'

export function useLiveSetsData() {
  const { data: liveSets, loading, error, refetch } = useApi<LiveSet[]>(
    '/api/live-sets',
    {},
    {},
    [] // No auto-fetch, we'll use static data for now
  )

  // For now, use static data structure - you can replace this with actual API data later
  const staticLiveSets = useMemo(() => {
    // This would normally come from an API
    // For now, we'll return an empty array or mock data
    return []
  }, [])

  return {
    liveSets: liveSets || staticLiveSets,
    loading,
    error,
    refetch,
  }
}

export function useLiveSetsFilters(liveSets: LiveSet[]) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'venue'>('date')

  const filteredLiveSets = useMemo(() => {
    let filtered = filterLiveSets(liveSets, searchTerm, selectedTags.length > 0 ? selectedTags : undefined)

    switch (sortBy) {
      case 'date':
        filtered = sortLiveSetsByDate(filtered)
        break
      case 'title':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'venue':
        filtered = [...filtered].sort((a, b) => (a.venue || '').localeCompare(b.venue || ''))
        break
    }

    return filtered
  }, [liveSets, searchTerm, selectedTags, sortBy])

  const groupedByYear = useMemo(() => {
    return groupLiveSetsByYear(filteredLiveSets)
  }, [filteredLiveSets])

  // Get all available tags from live sets
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    liveSets.forEach(liveSet => {
      liveSet.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [liveSets])

  return {
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    sortBy,
    setSortBy,
    filteredLiveSets,
    groupedByYear,
    availableTags,
  }
}

export function useLiveSet(liveSetId: string) {
  const { data: liveSet, loading, error } = useApi<LiveSet>(
    `/api/live-sets/${liveSetId}`,
    {},
    {},
    [liveSetId]
  )

  return {
    liveSet,
    loading,
    error,
  }
}
