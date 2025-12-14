/**
 * useResponsiveSize Hook
 * Centralized utility for calculating responsive font sizes and dimensions
 */

import { useState, useEffect, useMemo } from 'react'
import { breakpoints } from '@/themes/breakpoints'

interface UseResponsiveSizeOptions {
  minWidth?: number
  maxWidth?: number
  minSize?: number
  maxSize?: number
}

/**
 * Calculate responsive size based on viewport width
 * @param minSize - Minimum size (at minWidth)
 * @param maxSize - Maximum size (at maxWidth)
 * @param options - Configuration options
 * @returns Responsive size value as string (e.g., "42px")
 */
export function useResponsiveSize(
  minSize: number,
  maxSize: number,
  options: UseResponsiveSizeOptions = {}
): string {
  const {
    minWidth = 375,
    maxWidth = breakpoints.wide,
  } = options

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : maxWidth
  )

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const size = useMemo(() => {
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const calculatedSize = minSize + (maxSize - minSize) * ratio
    return `${calculatedSize}px`
  }, [viewportWidth, minSize, maxSize, minWidth, maxWidth])

  return size
}

/**
 * Calculate responsive size for title text
 * Common pattern: 28px (mobile) to 42px (desktop)
 */
export function useResponsiveTitleSize(): string {
  return useResponsiveSize(28, 42)
}

/**
 * Calculate responsive size for body text
 * Common pattern: 14px (mobile) to 16px (desktop)
 */
export function useResponsiveBodySize(): string {
  return useResponsiveSize(14, 16)
}

/**
 * Calculate responsive size for subtitle text
 * Common pattern: 10px (mobile) to 13px (desktop)
 */
export function useResponsiveSubtitleSize(): string {
  return useResponsiveSize(10, 13)
}

