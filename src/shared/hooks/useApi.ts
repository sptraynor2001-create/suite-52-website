import { useState, useEffect, useCallback } from 'react'
import { apiRequest, ApiResponse, ApiConfig, cachedApiRequest } from '../utils/api'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  status: number
}

/**
 * Custom hook for API requests with loading states and error handling
 */
export function useApi<T>(
  endpoint: string,
  options: RequestInit = {},
  config: Partial<ApiConfig> = {},
  deps: any[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    status: 0,
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response: ApiResponse<T> = await apiRequest<T>(endpoint, options, config)

      setState({
        data: response.data,
        loading: false,
        error: response.error || null,
        status: response.status,
      })

      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        status: 0,
      }))

      return { success: false, error: errorMessage } as ApiResponse<T>
    }
  }, [endpoint, JSON.stringify(options), JSON.stringify(config)])

  useEffect(() => {
    if (deps.length === 0 || deps.every(dep => dep !== undefined)) {
      execute()
    }
  }, deps)

  return {
    ...state,
    refetch: execute,
  }
}

/**
 * Custom hook for cached API requests
 */
export function useCachedApi<T>(
  endpoint: string,
  options: RequestInit = {},
  config: Partial<ApiConfig> = {},
  ttl: number = 300000, // 5 minutes
  deps: any[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    status: 0,
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response: ApiResponse<T> = await cachedApiRequest<T>(endpoint, options, config, ttl)

      setState({
        data: response.data,
        loading: false,
        error: response.error || null,
        status: response.status,
      })

      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        status: 0,
      }))

      return { success: false, error: errorMessage } as ApiResponse<T>
    }
  }, [endpoint, JSON.stringify(options), JSON.stringify(config), ttl])

  useEffect(() => {
    if (deps.length === 0 || deps.every(dep => dep !== undefined)) {
      execute()
    }
  }, deps)

  return {
    ...state,
    refetch: execute,
  }
}

/**
 * Custom hook for manual API calls (doesn't auto-execute)
 */
export function useApiCall<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    status: 0,
  })

  const execute = useCallback(async (
    endpoint: string,
    options: RequestInit = {},
    config: Partial<ApiConfig> = {}
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response: ApiResponse<T> = await apiRequest<T>(endpoint, options, config)

      setState({
        data: response.data,
        loading: false,
        error: response.error || null,
        status: response.status,
      })

      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        status: 0,
      }))

      return { success: false, error: errorMessage } as ApiResponse<T>
    }
  }, [])

  return {
    ...state,
    call: execute,
  }
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T) => Promise<T>
) {
  const [data, setData] = useState<T>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useCallback(async (newData: T) => {
    setLoading(true)
    setError(null)

    // Optimistic update
    const previousData = data
    setData(newData)

    try {
      const result = await updateFn(newData)
      setData(result)
    } catch (err) {
      // Revert on error
      setData(previousData)
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setLoading(false)
    }
  }, [data, updateFn])

  return {
    data,
    loading,
    error,
    update,
  }
}
