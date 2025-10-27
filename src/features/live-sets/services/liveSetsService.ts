/**
 * Live Sets feature services
 * Handles data fetching and business logic for live set operations
 */

import { apiGet } from '@/shared/utils'

export interface LiveSet {
  id: string
  title: string
  description?: string
  date: string
  venue?: string
  location?: string
  youtubeUrl?: string
  soundcloudUrl?: string
  spotifyUrl?: string
  thumbnail?: string
  duration?: string
  tags?: string[]
}

export interface LiveSetsData {
  liveSets: LiveSet[]
  featured: LiveSet[]
}

/**
 * Fetch all live sets
 */
export async function getLiveSets(): Promise<LiveSet[]> {
  try {
    const response = await apiGet<LiveSet[]>('/api/live-sets')
    return response.success ? response.data || [] : []
  } catch (error) {
    console.error('Failed to fetch live sets:', error)
    return []
  }
}

/**
 * Fetch featured live sets
 */
export async function getFeaturedLiveSets(): Promise<LiveSet[]> {
  try {
    const response = await apiGet<LiveSet[]>('/api/live-sets/featured')
    return response.success ? response.data || [] : []
  } catch (error) {
    console.error('Failed to fetch featured live sets:', error)
    return []
  }
}

/**
 * Get live set by ID
 */
export async function getLiveSetById(id: string): Promise<LiveSet | null> {
  try {
    const response = await apiGet<LiveSet>(`/api/live-sets/${id}`)
    return response.success ? response.data : null
  } catch (error) {
    console.error('Failed to fetch live set:', error)
    return null
  }
}

/**
 * Filter live sets by search term or tags
 */
export function filterLiveSets(liveSets: LiveSet[], searchTerm: string, tags?: string[]): LiveSet[] {
  let filtered = liveSets

  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filtered = filtered.filter(liveSet =>
      liveSet.title.toLowerCase().includes(term) ||
      liveSet.description?.toLowerCase().includes(term) ||
      liveSet.venue?.toLowerCase().includes(term) ||
      liveSet.location?.toLowerCase().includes(term)
    )
  }

  if (tags && tags.length > 0) {
    filtered = filtered.filter(liveSet =>
      tags.some(tag => liveSet.tags?.includes(tag))
    )
  }

  return filtered
}

/**
 * Sort live sets by date (newest first)
 */
export function sortLiveSetsByDate(liveSets: LiveSet[]): LiveSet[] {
  return [...liveSets].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

/**
 * Group live sets by year
 */
export function groupLiveSetsByYear(liveSets: LiveSet[]): Record<string, LiveSet[]> {
  return liveSets.reduce((groups, liveSet) => {
    const year = new Date(liveSet.date).getFullYear().toString()
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(liveSet)
    return groups
  }, {} as Record<string, LiveSet[]>)
}
