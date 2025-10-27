import { renderHook, waitFor } from '@testing-library/react'
import { useApi, useCachedApi, useApiCall, useOptimisticUpdate } from './useApi'
import { apiRequest } from '../utils/api'

// Mock the apiRequest function
jest.mock('../utils/api', () => ({
  apiRequest: jest.fn()
}))

const mockApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>

describe('useApi Hook', () => {
  beforeEach(() => {
    mockApiRequest.mockClear()
  })

  describe('useApi', () => {
    it('should return loading state initially', () => {
      mockApiRequest.mockImplementation(() => new Promise(() => {})) // Never resolves

      const { result } = renderHook(() =>
        useApi('/api/test', {}, {}, [])
      )

      expect(result.current.loading).toBe(true)
      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeNull()
    })

    it('should return data on successful request', async () => {
      const mockData = { id: 1, name: 'test' }
      mockApiRequest.mockResolvedValue({
        success: true,
        data: mockData,
        status: 200
      })

      const { result } = renderHook(() =>
        useApi('/api/test', {}, {}, [])
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.data).toEqual(mockData)
        expect(result.current.error).toBeNull()
      })
    })

    it('should return error on failed request', async () => {
      const mockError = new Error('API Error')
      mockApiRequest.mockResolvedValue({
        success: false,
        error: mockError.message,
        status: 500
      })

      const { result } = renderHook(() =>
        useApi('/api/test', {}, {}, [])
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.data).toBeNull()
        expect(result.current.error).toBe(mockError.message)
      })
    })

    it('should refetch when dependencies change', async () => {
      const mockData1 = { id: 1, name: 'test1' }
      const mockData2 = { id: 2, name: 'test2' }

      mockApiRequest.mockResolvedValueOnce({
        success: true,
        data: mockData1,
        status: 200
      }).mockResolvedValueOnce({
        success: true,
        data: mockData2,
        status: 200
      })

      const { result, rerender } = renderHook(
        (deps) => useApi('/api/test', {}, {}, deps),
        { initialProps: [1] }
      )

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData1)
      })

      rerender([2])

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData2)
        expect(mockApiRequest).toHaveBeenCalledTimes(2)
      })
    })

    it('should call refetch function', async () => {
      const mockData1 = { id: 1, name: 'test1' }
      const mockData2 = { id: 2, name: 'test2' }

      mockApiRequest.mockResolvedValueOnce({
        success: true,
        data: mockData1,
        status: 200
      }).mockResolvedValueOnce({
        success: true,
        data: mockData2,
        status: 200
      })

      const { result } = renderHook(() =>
        useApi('/api/test', {}, {}, [])
      )

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData1)
      })

      result.current.refetch()

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData2)
        expect(mockApiRequest).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('useCachedApi', () => {
    it('should use cached data when available', async () => {
      const mockData = { id: 1, name: 'cached' }
      mockApiRequest.mockResolvedValue({
        success: true,
        data: mockData,
        status: 200
      })

      const { result: result1 } = renderHook(() =>
        useCachedApi('/api/test', {}, {})
      )

      await waitFor(() => {
        expect(result1.current.data).toEqual(mockData)
      })

      // Second hook should use cached data
      const { result: result2 } = renderHook(() =>
        useCachedApi('/api/test', {}, {})
      )

      await waitFor(() => {
        expect(result2.current.data).toEqual(mockData)
        expect(mockApiRequest).toHaveBeenCalledTimes(1) // Only called once
      })
    })
  })

  describe('useApiCall', () => {
    it('should execute API call on trigger', async () => {
      const mockData = { success: true }
      mockApiRequest.mockResolvedValue({
        success: true,
        data: mockData,
        status: 200
      })

      const { result } = renderHook(() => useApiCall('/api/test'))

      expect(result.current.loading).toBe(false)
      expect(result.current.data).toBeNull()

      result.current.execute()

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.data).toEqual(mockData)
      })
    })

    it('should handle errors', async () => {
      const mockError = 'API Error'
      mockApiRequest.mockResolvedValue({
        success: false,
        error: mockError,
        status: 500
      })

      const { result } = renderHook(() => useApiCall('/api/test'))

      result.current.execute()

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBe(mockError)
        expect(result.current.data).toBeNull()
      })
    })
  })

  describe('useOptimisticUpdate', () => {
    it('should provide optimistic update functionality', () => {
      const initialData = [{ id: 1, name: 'item1' }]
      let currentData = initialData

      const { result } = renderHook(() => useOptimisticUpdate(currentData))

      expect(result.current.data).toEqual(initialData)
      expect(typeof result.current.update).toBe('function')
      expect(typeof result.current.rollback).toBe('function')
    })

    it('should perform optimistic update', () => {
      const initialData = [{ id: 1, name: 'item1' }]
      let currentData = initialData

      const { result } = renderHook(() => useOptimisticUpdate(currentData))

      const newItem = { id: 2, name: 'item2' }
      result.current.update((prev) => [...prev, newItem])

      expect(result.current.data).toEqual([...initialData, newItem])
    })

    it('should rollback changes', () => {
      const initialData = [{ id: 1, name: 'item1' }]
      let currentData = initialData

      const { result } = renderHook(() => useOptimisticUpdate(currentData))

      const newItem = { id: 2, name: 'item2' }
      result.current.update((prev) => [...prev, newItem])

      expect(result.current.data).toEqual([...initialData, newItem])

      result.current.rollback()

      expect(result.current.data).toEqual(initialData)
    })
  })
})
