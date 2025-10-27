/**
 * Custom hooks for music feature data management
 */

import { useState, useMemo } from 'react'
import { useApi } from '@/shared/hooks'
import { sortReleasesByDate, filterReleases, Release } from '../services/musicService'

export function useMusicData() {
  const { data: releases, loading, error, refetch } = useApi<Release[]>(
    '/api/releases',
    {},
    {},
    [] // No auto-fetch, we'll use the static data for now
  )

  // For now, we'll use the static data and simulate the API response
  const staticReleases = useMemo(() => {
    // Import the static data
    const { releases: staticData } = require('../data')
    return sortReleasesByDate(staticData)
  }, [])

  return {
    releases: releases || staticReleases,
    loading,
    error,
    refetch,
  }
}

export function useMusicFilters(releases: Release[]) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'artist'>('date')

  const filteredReleases = useMemo(() => {
    let filtered = filterReleases(releases, searchTerm)

    switch (sortBy) {
      case 'date':
        filtered = sortReleasesByDate(filtered)
        break
      case 'title':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'artist':
        filtered = [...filtered].sort((a, b) => a.artists.localeCompare(b.artists))
        break
    }

    return filtered
  }, [releases, searchTerm, sortBy])

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filteredReleases,
  }
}

export function useRelease(releaseId: string) {
  const { data: release, loading, error } = useApi<Release>(
    `/api/releases/${releaseId}`,
    {},
    {},
    [releaseId]
  )

  return {
    release,
    loading,
    error,
  }
}
