/**
 * useIsMobile Hook
 * Centralized mobile device detection
 */

import { useState, useEffect } from 'react'
import { breakpoints } from '@/themes/breakpoints'

/**
 * Detect if current device is mobile
 * Checks viewport width and user agent
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      window.innerWidth < breakpoints.tablet ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    )
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < breakpoints.tablet ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      )
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}
