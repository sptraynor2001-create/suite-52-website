import {
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  cachedApiRequest,
  apiCache,
  createApiEndpoints,
  handleApiError,
  DEFAULT_API_CONFIG
} from './api'

// Mock fetch globally
global.fetch = jest.fn()

describe('API Utilities', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    mockFetch.mockClear()
    apiCache.clear()
  })

  describe('DEFAULT_API_CONFIG', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_API_CONFIG.baseURL).toBe('/api')
      expect(DEFAULT_API_CONFIG.timeout).toBe(10000)
      expect(DEFAULT_API_CONFIG.retries).toBe(3)
      expect(DEFAULT_API_CONFIG.headers['Content-Type']).toBe('application/json')
    })
  })

  describe('apiRequest', () => {
    it('should make successful GET request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ data: 'test' })
      }
      mockFetch.mockResolvedValue(mockResponse as any)

      const result = await apiRequest('/test')

      expect(mockFetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: expect.any(AbortSignal)
      })
      expect(result).toEqual({
        data: { data: 'test' },
        success: true,
        status: 200
      })
    })

    it('should handle HTTP errors', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      }
      mockFetch.mockResolvedValue(mockResponse as any)

      const result = await apiRequest('/test')

      expect(result.success).toBe(false)
      expect(result.status).toBe(0)
    })

    it('should retry on failure', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }
      mockFetch.mockResolvedValue(mockResponse as any)

      await apiRequest('/test', {}, { retries: 2 })

      expect(mockFetch).toHaveBeenCalledTimes(3) // initial + 2 retries
    })

    it('should not retry on client errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      }
      mockFetch.mockResolvedValue(mockResponse as any)

      await apiRequest('/test')

      expect(mockFetch).toHaveBeenCalledTimes(1) // no retries for 4xx
    })

    it('should timeout requests', async () => {
      mockFetch.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({})
        } as any), 15000))
      )

      const result = await apiRequest('/test', {}, { timeout: 100 })

      expect(result.success).toBe(false)
    })
  })

  describe('HTTP method wrappers', () => {
    beforeEach(() => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ success: true })
      }
      mockFetch.mockResolvedValue(mockResponse as any)
    })

    it('apiGet should make GET request', async () => {
      await apiGet('/test')
      expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'GET'
      }))
    })

    it('apiPost should make POST request with data', async () => {
      const data = { name: 'test' }
      await apiPost('/test', data)

      expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(data)
      }))
    })

    it('apiPut should make PUT request with data', async () => {
      const data = { name: 'test' }
      await apiPut('/test', data)

      expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(data)
      }))
    })

    it('apiDelete should make DELETE request', async () => {
      await apiDelete('/test')
      expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'DELETE'
      }))
    })
  })

  describe('cachedApiRequest', () => {
    it('should cache successful responses', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ data: 'cached' })
      }
      mockFetch.mockResolvedValue(mockResponse as any)

      // First call
      const result1 = await cachedApiRequest('/test')
      expect(result1.data).toBe('cached')

      // Second call should use cache
      const result2 = await cachedApiRequest('/test')
      expect(result2.data).toBe('cached')
      expect(mockFetch).toHaveBeenCalledTimes(1) // Only called once
    })

    it('should not cache failed responses', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Server Error'
      }
      mockFetch.mockResolvedValue(mockResponse as any)

      await cachedApiRequest('/test')
      await cachedApiRequest('/test')

      expect(mockFetch).toHaveBeenCalledTimes(2) // Called twice, not cached
    })
  })

  describe('createApiEndpoints', () => {
    it('should create endpoint object', () => {
      const endpoints = createApiEndpoints('https://api.example.com')

      expect(endpoints.releases).toBe('https://api.example.com/releases')
      expect(endpoints.liveSets).toBe('https://api.example.com/live-sets')
      expect(endpoints.getRelease('123')).toBe('https://api.example.com/releases/123')
    })
  })

  describe('handleApiError', () => {
    it('should handle ApiError instances', () => {
      const apiError = { status: 404, data: null, message: 'Not found' }
      const result = handleApiError(apiError)

      expect(result.success).toBe(false)
      expect(result.status).toBe(404)
    })

    it('should handle generic errors', () => {
      const error = new Error('Network error')
      const result = handleApiError(error)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })

    it('should handle unknown errors', () => {
      const result = handleApiError('unknown')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Unknown error occurred')
    })
  })

  describe('apiCache', () => {
    it('should store and retrieve cached data', () => {
      const data = { test: 'data' }
      apiCache.set('test-key', data, 5000)

      const cached = apiCache.get('test-key')
      expect(cached).toEqual(data)
    })

    it('should expire cached data', () => {
      const data = { test: 'data' }
      apiCache.set('test-key', data, -1000) // Already expired

      const cached = apiCache.get('test-key')
      expect(cached).toBeNull()
    })

    it('should clear all cached data', () => {
      apiCache.set('key1', 'data1')
      apiCache.set('key2', 'data2')

      apiCache.clear()

      expect(apiCache.get('key1')).toBeNull()
      expect(apiCache.get('key2')).toBeNull()
    })
  })
})
