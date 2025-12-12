/**
 * AdaptiveQuality - Device detection and quality presets
 * Automatically adjusts 3D scene quality based on device capabilities
 */

import { createContext, useContext, useEffect, useState, useRef, ReactNode, useCallback } from 'react'
import { getGPUTier, TierResult } from 'detect-gpu'

export type QualityLevel = 'low' | 'medium' | 'high'

export interface QualitySettings {
  level: QualityLevel
  particleCount: number
  postProcessing: boolean
  bloom: boolean
  chromaticAberration: boolean
  antialias: boolean
  shadows: boolean
  targetFPS: number
  pixelRatio: number
  fogDensity: number
}

const qualityPresets: Record<QualityLevel, QualitySettings> = {
  low: {
    level: 'low',
    particleCount: 500,
    postProcessing: false,
    bloom: false,
    chromaticAberration: false,
    antialias: false,
    shadows: false,
    targetFPS: 30,
    pixelRatio: 1,
    fogDensity: 0.02,
  },
  medium: {
    level: 'medium',
    particleCount: 2000,
    postProcessing: true,
    bloom: true,
    chromaticAberration: false,
    antialias: true,
    shadows: false,
    targetFPS: 60,
    pixelRatio: Math.min(1.5, typeof window !== 'undefined' ? window.devicePixelRatio : 1),
    fogDensity: 0.015,
  },
  high: {
    level: 'high',
    particleCount: 5000,
    postProcessing: true,
    bloom: true,
    chromaticAberration: true,
    antialias: true,
    shadows: true,
    targetFPS: 60,
    pixelRatio: Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 2),
    fogDensity: 0.01,
  },
}

interface QualityContextType {
  settings: QualitySettings
  isMobile: boolean
  isLoading: boolean
  gpuTier: number
  setQualityLevel: (level: QualityLevel) => void
}

const QualityContext = createContext<QualityContextType | null>(null)

export function useQuality(): QualityContextType {
  const context = useContext(QualityContext)
  if (!context) {
    // Return default values if used outside provider (for SSR safety)
    return {
      settings: qualityPresets.medium,
      isMobile: false,
      isLoading: true,
      gpuTier: 2,
      setQualityLevel: () => {},
    }
  }
  return context
}

interface QualityProviderProps {
  children: ReactNode
  forceQuality?: QualityLevel
}

export function QualityProvider({ children, forceQuality }: QualityProviderProps) {
  const [settings, setSettings] = useState<QualitySettings>(qualityPresets.medium)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [gpuTier, setGpuTier] = useState(2)
  const fpsRef = useRef<number[]>([])
  const lastFrameTimeRef = useRef(0)

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => {
      if (typeof window === 'undefined') return false
      
      const mobile = window.innerWidth < 768 || 
        window.innerHeight < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      setIsMobile(mobile)
      return mobile
    }

    const mobile = checkMobile()
    window.addEventListener('resize', checkMobile)

    // If quality is forced, use that
    if (forceQuality) {
      setSettings(qualityPresets[forceQuality])
      setIsLoading(false)
      return () => window.removeEventListener('resize', checkMobile)
    }

    // Detect GPU and set quality
    const detectQuality = async () => {
      try {
        const gpuTierResult: TierResult = await getGPUTier()
        const tier = gpuTierResult.tier
        setGpuTier(tier)

        let level: QualityLevel
        if (mobile) {
          // Mobile devices get lower quality regardless of GPU
          // Be more conservative on mobile
          level = tier >= 3 ? 'medium' : 'low'
        } else {
          // Desktop quality based on GPU tier
          if (tier >= 3) {
            level = 'high'
          } else if (tier >= 2) {
            level = 'medium'
          } else {
            level = 'low'
          }
        }

        // Check for battery saver mode
        if ('getBattery' in navigator) {
          try {
            const battery = await (navigator as any).getBattery()
            if (battery.level < 0.2 && !battery.charging) {
              // Low battery, reduce quality
              level = level === 'high' ? 'medium' : 'low'
            }
          } catch {
            // Battery API not available
          }
        }

        setSettings(qualityPresets[level])
      } catch (error) {
        // Fallback to medium on error (low on mobile)
        console.warn('GPU detection failed, using default quality:', error)
        setSettings(qualityPresets[mobile ? 'low' : 'medium'])
      } finally {
        setIsLoading(false)
      }
    }

    detectQuality()

    return () => window.removeEventListener('resize', checkMobile)
  }, [forceQuality])

  // Dynamic quality adjustment based on FPS
  useEffect(() => {
    if (isLoading || forceQuality) return

    let animationId: number
    let degradeTimeout: NodeJS.Timeout | null = null

    const measureFPS = (timestamp: number) => {
      if (lastFrameTimeRef.current) {
        const fps = 1000 / (timestamp - lastFrameTimeRef.current)
        fpsRef.current.push(fps)

        // Keep last 60 frames
        if (fpsRef.current.length > 60) {
          fpsRef.current.shift()
        }

        // Check average FPS every 2 seconds
        if (fpsRef.current.length >= 60 && !degradeTimeout) {
          const avgFPS = fpsRef.current.reduce((a, b) => a + b) / fpsRef.current.length

          if (avgFPS < 25 && settings.level !== 'low') {
            // FPS is too low, degrade quality
            degradeTimeout = setTimeout(() => {
              setSettings(prev => {
                if (prev.level === 'high') return qualityPresets.medium
                if (prev.level === 'medium') return qualityPresets.low
                return prev
              })
              fpsRef.current = []
              degradeTimeout = null
            }, 1000)
          }
        }
      }

      lastFrameTimeRef.current = timestamp
      animationId = requestAnimationFrame(measureFPS)
    }

    animationId = requestAnimationFrame(measureFPS)

    return () => {
      cancelAnimationFrame(animationId)
      if (degradeTimeout) clearTimeout(degradeTimeout)
    }
  }, [isLoading, forceQuality, settings.level])

  const setQualityLevel = useCallback((level: QualityLevel) => {
    setSettings(qualityPresets[level])
    fpsRef.current = [] // Reset FPS tracking
  }, [])

  return (
    <QualityContext.Provider value={{ settings, isMobile, isLoading, gpuTier, setQualityLevel }}>
      {children}
    </QualityContext.Provider>
  )
}

// Hook for frame throttling on mobile
export function useThrottledFrame(callback: (delta: number) => void, fps: number = 30) {
  const frameInterval = 1000 / fps
  let lastTime = 0

  return (state: { clock: { getElapsedTime: () => number } }, delta: number) => {
    const currentTime = state.clock.getElapsedTime() * 1000
    if (currentTime - lastTime >= frameInterval) {
      lastTime = currentTime
      callback(delta)
    }
  }
}

// Hook to check if device can handle 3D
export function useCanRender3D(): boolean {
  const [canRender, setCanRender] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setCanRender(false)
      return
    }

    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setCanRender(!!gl)
    } catch {
      setCanRender(false)
    }
  }, [])

  return canRender
}

// Reduced motion preference
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

export { qualityPresets }
