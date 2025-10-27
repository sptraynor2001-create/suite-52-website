import { renderHook, waitFor } from '@testing-library/react'
import { useMusicData, useMusicFilters, useRelease } from './useMusicData'
import { apiGet } from '@/shared/utils'
import { Release } from '../services/musicService'

// Mock the API utility and data
jest.mock('@/shared/utils', () => ({
  apiGet: jest.fn()
}))

jest.mock('../data', () => ({
  releases: [
    {
      id: '1',
      title: 'Static Release 1',
      artists: 'Static Artist 1',
      date: '2023-01-01'
    },
    {
      id: '2',
      title: 'Static Release 2',
      artists: 'Static Artist 2',
      date: '2024-01-01'
    }
  ]
}))

const mockApiGet = apiGet as jest.MockedFunction<typeof apiGet>

describe('useMusicData Hook', () => {
  beforeEach(() => {
    mockApiGet.mockClear()
  })

  describe('useMusicData', () => {
    it('should return loading state initially', () => {
      mockApiGet.mockImplementation(() => new Promise(() => {})) // Never resolves

      const { result } = renderHook(() => useMusicData())

      expect(result.current.loading).toBe(true)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeNull()
    })

    it('should return API data when successful', async () => {
      const mockReleases: Release[] = [
        {
          id: '1',
          title: 'API Release 1',
          artists: 'API Artist 1',
          date: '2024-01-01'
        }
      ]

      mockApiGet.mockResolvedValue({
        success: true,
        data: mockReleases,
        status: 200
      })

      const { result } = renderHook(() => useMusicData())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.data).toEqual(mockReleases)
        expect(result.current.error).toBeNull()
      })
    })

    it('should fallback to static data when API fails', async () => {
      mockApiGet.mockResolvedValue({
        success: false,
        error: 'API Error',
        status: 500
      })

      const { result } = renderHook(() => useMusicData())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.data).toHaveLength(2) // Static data
        expect(result.current.data?.[0].title).toBe('Static Release 1')
        expect(result.current.error).toBe('API Error')
      })
    })

    it('should handle API errors gracefully', async () => {
      mockApiGet.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useMusicData())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.data).toHaveLength(2) // Static data
        expect(result.current.error).toBe('Network error')
      })
    })

    it('should call refetch function', async () => {
      const mockReleases1: Release[] = [
        { id: '1', title: 'Release 1', artists: 'Artist 1', date: '2024-01-01' }
      ]
      const mockReleases2: Release[] = [
        { id: '2', title: 'Release 2', artists: 'Artist 2', date: '2024-01-02' }
      ]

      mockApiGet.mockResolvedValueOnce({
        success: true,
        data: mockReleases1,
        status: 200
      }).mockResolvedValueOnce({
        success: true,
        data: mockReleases2,
        status: 200
      })

      const { result } = renderHook(() => useMusicData())

      await waitFor(() => {
        expect(result.current.data).toEqual(mockReleases1)
      })

      result.current.refetch()

      await waitFor(() => {
        expect(result.current.data).toEqual(mockReleases2)
        expect(mockApiGet).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('useMusicFilters', () => {
    const mockReleases: Release[] = [
      {
        id: '1',
        title: 'Summer Nights',
        artists: 'Beach Band',
        date: '2024-01-01',
        label: 'Ocean Records'
      },
      {
        id: '2',
        title: 'Winter Dreams',
        artists: 'Snow Artists',
        date: '2023-01-01',
        label: 'Mountain Music'
      },
      {
        id: '3',
        title: 'Spring Awakening',
        artists: 'Nature Sounds',
        date: '2024-06-01'
      }
    ]

    it('should initialize with default values', () => {
      const { result } = renderHook(() => useMusicFilters(mockReleases))

      expect(result.current.searchTerm).toBe('')
      expect(result.current.sortBy).toBe('date')
      expect(result.current.filteredReleases).toEqual(mockReleases)
    })

    it('should filter by search term', () => {
      const { result } = renderHook(() => useMusicFilters(mockReleases))

      // Trigger search
      result.current.setSearchTerm('Summer')

      expect(result.current.filteredReleases).toHaveLength(1)
      expect(result.current.filteredReleases[0].title).toBe('Summer Nights')
    })

    it('should sort by date (newest first)', () => {
      const { result } = renderHook(() => useMusicFilters(mockReleases))

      result.current.setSortBy('date')

      expect(result.current.filteredReleases[0].id).toBe('3') // 2024-06-01
      expect(result.current.filteredReleases[1].id).toBe('1') // 2024-01-01
      expect(result.current.filteredReleases[2].id).toBe('2') // 2023-01-01
    })

    it('should sort by title', () => {
      const { result } = renderHook(() => useMusicFilters(mockReleases))

      result.current.setSortBy('title')

      expect(result.current.filteredReleases[0].title).toBe('Spring Awakening')
      expect(result.current.filteredReleases[1].title).toBe('Summer Nights')
      expect(result.current.filteredReleases[2].title).toBe('Winter Dreams')
    })

    it('should sort by artist', () => {
      const { result } = renderHook(() => useMusicFilters(mockReleases))

      result.current.setSortBy('artist')

      expect(result.current.filteredReleases[0].artists).toBe('Beach Band')
      expect(result.current.filteredReleases[1].artists).toBe('Nature Sounds')
      expect(result.current.filteredReleases[2].artists).toBe('Snow Artists')
    })

    it('should combine search and sort', () => {
      const { result } = renderHook(() => useMusicFilters(mockReleases))

      result.current.setSearchTerm('Nights')
      result.current.setSortBy('date')

      expect(result.current.filteredReleases).toHaveLength(1)
      expect(result.current.filteredReleases[0].title).toBe('Summer Nights')
    })

    it('should be case insensitive', () => {
      const { result } = renderHook(() => useMusicFilters(mockReleases))

      result.current.setSearchTerm('summer')

      expect(result.current.filteredReleases).toHaveLength(1)
      expect(result.current.filteredReleases[0].title).toBe('Summer Nights')
    })

    it('should handle empty search results', () => {
      const { result } = renderHook(() => useMusicFilters(mockReleases))

      result.current.setSearchTerm('nonexistent')

      expect(result.current.filteredReleases).toHaveLength(0)
    })

    it('should handle empty releases array', () => {
      const { result } = renderHook(() => useMusicFilters([]))

      expect(result.current.filteredReleases).toEqual([])
    })
  })

  describe('useRelease', () => {
    it('should fetch release by ID successfully', async () => {
      const mockRelease: Release = {
        id: '1',
        title: 'Test Release',
        artists: 'Test Artist',
        date: '2024-01-01'
      }

      mockApiGet.mockResolvedValue({
        success: true,
        data: mockRelease,
        status: 200
      })

      const { result } = renderHook(() => useRelease('1'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.release).toEqual(mockRelease)
        expect(result.current.error).toBeNull()
      })
    })

    it('should handle API errors', async () => {
      mockApiGet.mockResolvedValue({
        success: false,
        error: 'Not found',
        status: 404
      })

      const { result } = renderHook(() => useRelease('1'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.release).toBeNull()
        expect(result.current.error).toBe('Not found')
      })
    })

    it('should refetch when ID changes', async () => {
      const mockRelease1: Release = { id: '1', title: 'Release 1', artists: 'Artist 1', date: '2024-01-01' }
      const mockRelease2: Release = { id: '2', title: 'Release 2', artists: 'Artist 2', date: '2024-01-02' }

      mockApiGet.mockResolvedValueOnce({
        success: true,
        data: mockRelease1,
        status: 200
      }).mockResolvedValueOnce({
        success: true,
        data: mockRelease2,
        status: 200
      })

      const { result, rerender } = renderHook(
        (id) => useRelease(id),
        { initialProps: '1' }
      )

      await waitFor(() => {
        expect(result.current.release).toEqual(mockRelease1)
      })

      rerender('2')

      await waitFor(() => {
        expect(result.current.release).toEqual(mockRelease2)
        expect(mockApiGet).toHaveBeenCalledTimes(2)
      })
    })
  })
})
