/**
 * API utilities for data fetching, caching, and error handling
 */

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
  status: number
}

export interface ApiConfig {
  baseURL: string
  timeout: number
  retries: number
  headers: Record<string, string>
}

/**
 * Default API configuration
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
  },
}

/**
 * Generic API request function with error handling and retries
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  config: Partial<ApiConfig> = {}
): Promise<ApiResponse<T>> {
  const finalConfig = { ...DEFAULT_API_CONFIG, ...config }
  const url = `${finalConfig.baseURL}${endpoint}`

  let lastError: Error

  for (let attempt = 1; attempt <= finalConfig.retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout)

      const response = await fetch(url, {
        ...options,
        headers: {
          ...finalConfig.headers,
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        data,
        success: true,
        status: response.status,
      }
    } catch (error) {
      lastError = error as Error

      // Don't retry on client errors (4xx)
      if (error instanceof Error && error.message.includes('HTTP 4')) {
        break
      }

      // Wait before retrying (exponential backoff)
      if (attempt < finalConfig.retries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  return {
    data: null as T,
    success: false,
    error: lastError!.message,
    status: 0,
  }
}

/**
 * GET request wrapper
 */
export async function apiGet<T>(
  endpoint: string,
  config?: Partial<ApiConfig>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'GET' }, config)
}

/**
 * POST request wrapper
 */
export async function apiPost<T>(
  endpoint: string,
  data: any,
  config?: Partial<ApiConfig>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }, config)
}

/**
 * PUT request wrapper
 */
export async function apiPut<T>(
  endpoint: string,
  data: any,
  config?: Partial<ApiConfig>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, config)
}

/**
 * DELETE request wrapper
 */
export async function apiDelete<T>(
  endpoint: string,
  config?: Partial<ApiConfig>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' }, config)
}

/**
 * Simple cache implementation
 */
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }
}

export const apiCache = new ApiCache()

/**
 * Cached API request
 */
export async function cachedApiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  config: Partial<ApiConfig> = {},
  ttl: number = 300000
): Promise<ApiResponse<T>> {
  const cacheKey = `${options.method || 'GET'}-${endpoint}-${JSON.stringify(options.body || {})}`

  // Check cache first
  const cached = apiCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // Make request
  const response = await apiRequest<T>(endpoint, options, config)

  // Cache successful responses
  if (response.success) {
    apiCache.set(cacheKey, response, ttl)
  }

  return response
}

/**
 * Create API endpoints object for better organization
 */
export function createApiEndpoints(baseURL: string) {
  return {
    // Example endpoints - customize for your app
    releases: `${baseURL}/releases`,
    liveSets: `${baseURL}/live-sets`,
    shows: `${baseURL}/shows`,
    contact: `${baseURL}/contact`,

    // Helper methods
    getRelease: (id: string) => `${baseURL}/releases/${id}`,
    getLiveSet: (id: string) => `${baseURL}/live-sets/${id}`,
    getShow: (id: string) => `${baseURL}/shows/${id}`,
  }
}

/**
 * Error handling utilities
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown): ApiResponse<null> {
  if (error instanceof ApiError) {
    return {
      data: null,
      success: false,
      error: error.message,
      status: error.status,
    }
  }

  if (error instanceof Error) {
    return {
      data: null,
      success: false,
      error: error.message,
      status: 0,
    }
  }

  return {
    data: null,
    success: false,
    error: 'Unknown error occurred',
    status: 0,
  }
}
