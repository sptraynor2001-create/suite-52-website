/**
 * Music feature services
 * Handles data fetching and business logic for music-related operations
 */

import { apiGet } from '@/shared/utils'

export interface Release {
  id: string
  title: string
  artists: string
  label?: string
  date: string
  coverArt?: string
  spotifyUrl?: string
  soundcloudUrl?: string
  youtubeUrl?: string
  appleMusicUrl?: string
}

export interface MusicData {
  releases: Release[]
  featured: Release[]
}

/**
 * Fetch all music releases
 */
export async function getReleases(): Promise<Release[]> {
  try {
    const response = await apiGet<Release[]>('/api/releases')
    return response.success ? response.data || [] : []
  } catch (error) {
    console.error('Failed to fetch releases:', error)
    return []
  }
}

/**
 * Fetch featured releases
 */
export async function getFeaturedReleases(): Promise<Release[]> {
  try {
    const response = await apiGet<Release[]>('/api/releases/featured')
    return response.success ? response.data || [] : []
  } catch (error) {
    console.error('Failed to fetch featured releases:', error)
    return []
  }
}

/**
 * Get release by ID
 */
export async function getReleaseById(id: string): Promise<Release | null> {
  try {
    const response = await apiGet<Release>(`/api/releases/${id}`)
    return response.success ? response.data : null
  } catch (error) {
    console.error('Failed to fetch release:', error)
    return null
  }
}

/**
 * Filter releases by search term
 */
export function filterReleases(releases: Release[], searchTerm: string): Release[] {
  if (!searchTerm) return releases

  const term = searchTerm.toLowerCase()
  return releases.filter(release =>
    release.title.toLowerCase().includes(term) ||
    release.artists.toLowerCase().includes(term) ||
    release.label?.toLowerCase().includes(term)
  )
}

/**
 * Sort releases by date (newest first)
 */
export function sortReleasesByDate(releases: Release[]): Release[] {
  return [...releases].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
