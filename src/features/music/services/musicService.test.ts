import {
  getReleases,
  getFeaturedReleases,
  getReleaseById,
  filterReleases,
  sortReleasesByDate,
  Release
} from './musicService'
import { apiGet } from '@/shared/utils'

// Mock the API utility
jest.mock('@/shared/utils', () => ({
  apiGet: jest.fn()
}))

const mockApiGet = apiGet as jest.MockedFunction<typeof apiGet>

describe('Music Service', () => {
  beforeEach(() => {
    mockApiGet.mockClear()
  })

  describe('getReleases', () => {
    it('should fetch releases successfully', async () => {
      const mockReleases: Release[] = [
        {
          id: '1',
          title: 'Test Release',
          artists: 'Test Artist',
          date: '2024-01-01'
        }
      ]

      mockApiGet.mockResolvedValue({
        success: true,
        data: mockReleases,
        status: 200
      })

      const result = await getReleases()

      expect(mockApiGet).toHaveBeenCalledWith('/api/releases')
      expect(result).toEqual(mockReleases)
    })

    it('should return empty array on API failure', async () => {
      mockApiGet.mockResolvedValue({
        success: false,
        error: 'API Error',
        status: 500
      })

      const result = await getReleases()

      expect(result).toEqual([])
    })

    it('should handle API errors gracefully', async () => {
      mockApiGet.mockRejectedValue(new Error('Network error'))

      const result = await getReleases()

      expect(result).toEqual([])
    })
  })

  describe('getFeaturedReleases', () => {
    it('should fetch featured releases successfully', async () => {
      const mockFeaturedReleases: Release[] = [
        {
          id: '1',
          title: 'Featured Release',
          artists: 'Featured Artist',
          date: '2024-01-01'
        }
      ]

      mockApiGet.mockResolvedValue({
        success: true,
        data: mockFeaturedReleases,
        status: 200
      })

      const result = await getFeaturedReleases()

      expect(mockApiGet).toHaveBeenCalledWith('/api/releases/featured')
      expect(result).toEqual(mockFeaturedReleases)
    })

    it('should return empty array on API failure', async () => {
      mockApiGet.mockResolvedValue({
        success: false,
        error: 'API Error',
        status: 500
      })

      const result = await getFeaturedReleases()

      expect(result).toEqual([])
    })
  })

  describe('getReleaseById', () => {
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

      const result = await getReleaseById('1')

      expect(mockApiGet).toHaveBeenCalledWith('/api/releases/1')
      expect(result).toEqual(mockRelease)
    })

    it('should return null when release not found', async () => {
      mockApiGet.mockResolvedValue({
        success: false,
        error: 'Not found',
        status: 404
      })

      const result = await getReleaseById('1')

      expect(result).toBeNull()
    })

    it('should handle API errors gracefully', async () => {
      mockApiGet.mockRejectedValue(new Error('Network error'))

      const result = await getReleaseById('1')

      expect(result).toBeNull()
    })
  })

  describe('filterReleases', () => {
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
        date: '2024-02-01',
        label: 'Mountain Music'
      },
      {
        id: '3',
        title: 'Spring Awakening',
        artists: 'Nature Sounds',
        date: '2024-03-01'
      }
    ]

    it('should return all releases when no search term', () => {
      const result = filterReleases(mockReleases, '')
      expect(result).toEqual(mockReleases)
    })

    it('should filter by title', () => {
      const result = filterReleases(mockReleases, 'Summer')
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Summer Nights')
    })

    it('should filter by artists', () => {
      const result = filterReleases(mockReleases, 'Beach')
      expect(result).toHaveLength(1)
      expect(result[0].artists).toBe('Beach Band')
    })

    it('should filter by label', () => {
      const result = filterReleases(mockReleases, 'Ocean')
      expect(result).toHaveLength(1)
      expect(result[0].label).toBe('Ocean Records')
    })

    it('should be case insensitive', () => {
      const result = filterReleases(mockReleases, 'summer')
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Summer Nights')
    })

    it('should return multiple matches', () => {
      const result = filterReleases(mockReleases, 'Artists')
      expect(result).toHaveLength(2)
      expect(result.map(r => r.id)).toEqual(['2', '3'])
    })
  })

  describe('sortReleasesByDate', () => {
    const mockReleases: Release[] = [
      {
        id: '1',
        title: 'Old Release',
        artists: 'Artist 1',
        date: '2023-01-01'
      },
      {
        id: '2',
        title: 'New Release',
        artists: 'Artist 2',
        date: '2024-01-01'
      },
      {
        id: '3',
        title: 'Medium Release',
        artists: 'Artist 3',
        date: '2023-06-01'
      }
    ]

    it('should sort releases by date (newest first)', () => {
      const result = sortReleasesByDate(mockReleases)

      expect(result[0].id).toBe('2') // Newest
      expect(result[1].id).toBe('3') // Medium
      expect(result[2].id).toBe('1') // Oldest
    })

    it('should handle invalid dates gracefully', () => {
      const releasesWithInvalidDate = [
        ...mockReleases,
        {
          id: '4',
          title: 'Invalid Date',
          artists: 'Artist 4',
          date: 'invalid-date'
        }
      ]

      const result = sortReleasesByDate(releasesWithInvalidDate)
      expect(result).toHaveLength(4)
    })

    it('should return new array (not mutate original)', () => {
      const original = [...mockReleases]
      const result = sortReleasesByDate(mockReleases)

      expect(result).not.toBe(mockReleases)
      expect(mockReleases).toEqual(original)
    })
  })
})
