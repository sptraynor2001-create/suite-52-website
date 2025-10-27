import {
  getLiveSets,
  getFeaturedLiveSets,
  getLiveSetById,
  filterLiveSets,
  sortLiveSetsByDate,
  groupLiveSetsByYear,
  LiveSet
} from './liveSetsService'
import { apiGet } from '@/shared/utils'

// Mock the API utility
jest.mock('@/shared/utils', () => ({
  apiGet: jest.fn()
}))

const mockApiGet = apiGet as jest.MockedFunction<typeof apiGet>

describe('Live Sets Service', () => {
  beforeEach(() => {
    mockApiGet.mockClear()
  })

  describe('getLiveSets', () => {
    it('should fetch live sets successfully', async () => {
      const mockLiveSets: LiveSet[] = [
        {
          id: '1',
          title: 'Test Live Set',
          date: '2024-01-01',
          venue: 'Test Venue'
        }
      ]

      mockApiGet.mockResolvedValue({
        success: true,
        data: mockLiveSets,
        status: 200
      })

      const result = await getLiveSets()

      expect(mockApiGet).toHaveBeenCalledWith('/api/live-sets')
      expect(result).toEqual(mockLiveSets)
    })

    it('should return empty array on API failure', async () => {
      mockApiGet.mockResolvedValue({
        success: false,
        error: 'API Error',
        status: 500
      })

      const result = await getLiveSets()

      expect(result).toEqual([])
    })

    it('should handle API errors gracefully', async () => {
      mockApiGet.mockRejectedValue(new Error('Network error'))

      const result = await getLiveSets()

      expect(result).toEqual([])
    })
  })

  describe('getFeaturedLiveSets', () => {
    it('should fetch featured live sets successfully', async () => {
      const mockFeaturedLiveSets: LiveSet[] = [
        {
          id: '1',
          title: 'Featured Live Set',
          date: '2024-01-01',
          venue: 'Featured Venue'
        }
      ]

      mockApiGet.mockResolvedValue({
        success: true,
        data: mockFeaturedLiveSets,
        status: 200
      })

      const result = await getFeaturedLiveSets()

      expect(mockApiGet).toHaveBeenCalledWith('/api/live-sets/featured')
      expect(result).toEqual(mockFeaturedLiveSets)
    })

    it('should return empty array on API failure', async () => {
      mockApiGet.mockResolvedValue({
        success: false,
        error: 'API Error',
        status: 500
      })

      const result = await getFeaturedLiveSets()

      expect(result).toEqual([])
    })
  })

  describe('getLiveSetById', () => {
    it('should fetch live set by ID successfully', async () => {
      const mockLiveSet: LiveSet = {
        id: '1',
        title: 'Test Live Set',
        date: '2024-01-01',
        venue: 'Test Venue'
      }

      mockApiGet.mockResolvedValue({
        success: true,
        data: mockLiveSet,
        status: 200
      })

      const result = await getLiveSetById('1')

      expect(mockApiGet).toHaveBeenCalledWith('/api/live-sets/1')
      expect(result).toEqual(mockLiveSet)
    })

    it('should return null when live set not found', async () => {
      mockApiGet.mockResolvedValue({
        success: false,
        error: 'Not found',
        status: 404
      })

      const result = await getLiveSetById('1')

      expect(result).toBeNull()
    })

    it('should handle API errors gracefully', async () => {
      mockApiGet.mockRejectedValue(new Error('Network error'))

      const result = await getLiveSetById('1')

      expect(result).toBeNull()
    })
  })

  describe('filterLiveSets', () => {
    const mockLiveSets: LiveSet[] = [
      {
        id: '1',
        title: 'Summer Festival',
        description: 'Amazing summer vibes',
        date: '2024-07-01',
        venue: 'Beach Arena',
        location: 'Miami',
        tags: ['electronic', 'summer']
      },
      {
        id: '2',
        title: 'Winter Chill',
        description: 'Cozy winter session',
        date: '2024-01-15',
        venue: 'Mountain Lodge',
        location: 'Colorado',
        tags: ['ambient', 'winter']
      },
      {
        id: '3',
        title: 'Spring Awakening',
        description: 'Fresh spring sounds',
        date: '2024-04-01',
        venue: 'Garden Stage',
        location: 'California'
      }
    ]

    it('should return all live sets when no search term and no tags', () => {
      const result = filterLiveSets(mockLiveSets, '', [])
      expect(result).toEqual(mockLiveSets)
    })

    it('should filter by title', () => {
      const result = filterLiveSets(mockLiveSets, 'Summer', [])
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Summer Festival')
    })

    it('should filter by description', () => {
      const result = filterLiveSets(mockLiveSets, 'vibes', [])
      expect(result).toHaveLength(1)
      expect(result[0].description).toBe('Amazing summer vibes')
    })

    it('should filter by venue', () => {
      const result = filterLiveSets(mockLiveSets, 'Beach', [])
      expect(result).toHaveLength(1)
      expect(result[0].venue).toBe('Beach Arena')
    })

    it('should filter by location', () => {
      const result = filterLiveSets(mockLiveSets, 'Miami', [])
      expect(result).toHaveLength(1)
      expect(result[0].location).toBe('Miami')
    })

    it('should filter by tags', () => {
      const result = filterLiveSets(mockLiveSets, '', ['electronic'])
      expect(result).toHaveLength(1)
      expect(result[0].tags).toContain('electronic')
    })

    it('should combine search term and tags filtering', () => {
      const result = filterLiveSets(mockLiveSets, 'Festival', ['electronic'])
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Summer Festival')
      expect(result[0].tags).toContain('electronic')
    })

    it('should be case insensitive', () => {
      const result = filterLiveSets(mockLiveSets, 'summer', [])
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Summer Festival')
    })

    it('should return multiple matches', () => {
      const result = filterLiveSets(mockLiveSets, 'Stage', [])
      expect(result).toHaveLength(1)
      expect(result[0].venue).toBe('Garden Stage')
    })
  })

  describe('sortLiveSetsByDate', () => {
    const mockLiveSets: LiveSet[] = [
      {
        id: '1',
        title: 'Old Live Set',
        date: '2023-01-01'
      },
      {
        id: '2',
        title: 'New Live Set',
        date: '2024-01-01'
      },
      {
        id: '3',
        title: 'Medium Live Set',
        date: '2023-06-01'
      }
    ]

    it('should sort live sets by date (newest first)', () => {
      const result = sortLiveSetsByDate(mockLiveSets)

      expect(result[0].id).toBe('2') // Newest
      expect(result[1].id).toBe('3') // Medium
      expect(result[2].id).toBe('1') // Oldest
    })

    it('should handle invalid dates gracefully', () => {
      const liveSetsWithInvalidDate = [
        ...mockLiveSets,
        {
          id: '4',
          title: 'Invalid Date Live Set',
          date: 'invalid-date'
        }
      ]

      const result = sortLiveSetsByDate(liveSetsWithInvalidDate)
      expect(result).toHaveLength(4)
    })

    it('should return new array (not mutate original)', () => {
      const original = [...mockLiveSets]
      const result = sortLiveSetsByDate(mockLiveSets)

      expect(result).not.toBe(mockLiveSets)
      expect(mockLiveSets).toEqual(original)
    })
  })

  describe('groupLiveSetsByYear', () => {
    const mockLiveSets: LiveSet[] = [
      {
        id: '1',
        title: '2023 Live Set 1',
        date: '2023-01-01'
      },
      {
        id: '2',
        title: '2023 Live Set 2',
        date: '2023-06-01'
      },
      {
        id: '3',
        title: '2024 Live Set 1',
        date: '2024-01-01'
      },
      {
        id: '4',
        title: '2024 Live Set 2',
        date: '2024-07-01'
      }
    ]

    it('should group live sets by year', () => {
      const result = groupLiveSetsByYear(mockLiveSets)

      expect(Object.keys(result)).toHaveLength(2)
      expect(result['2023']).toHaveLength(2)
      expect(result['2024']).toHaveLength(2)
    })

    it('should sort live sets within each year group by date', () => {
      const result = groupLiveSetsByYear(mockLiveSets)

      // 2023 group should have newer dates first
      expect(result['2023'][0].id).toBe('2') // 2023-06-01
      expect(result['2023'][1].id).toBe('1') // 2023-01-01

      // 2024 group should have newer dates first
      expect(result['2024'][0].id).toBe('4') // 2024-07-01
      expect(result['2024'][1].id).toBe('3') // 2024-01-01
    })

    it('should handle live sets with invalid dates', () => {
      const liveSetsWithInvalidDate = [
        ...mockLiveSets,
        {
          id: '5',
          title: 'Invalid Date Live Set',
          date: 'invalid-date'
        }
      ]

      const result = groupLiveSetsByYear(liveSetsWithInvalidDate)

      // Should still have the valid groups
      expect(Object.keys(result)).toHaveLength(2)
      expect(result['2023']).toHaveLength(2)
      expect(result['2024']).toHaveLength(2)
    })

    it('should return empty object for empty array', () => {
      const result = groupLiveSetsByYear([])
      expect(result).toEqual({})
    })

    it('should handle single live set per year', () => {
      const singleLiveSet = [{
        id: '1',
        title: 'Single Live Set',
        date: '2023-01-01'
      }]

      const result = groupLiveSetsByYear(singleLiveSet)
      expect(result['2023']).toHaveLength(1)
      expect(result['2023'][0].id).toBe('1')
    })
  })
})
