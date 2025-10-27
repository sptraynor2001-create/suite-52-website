/**
 * Responsive utilities for handling viewport, breakpoints, and responsive design
 */

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide'

export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1440
} as const

/**
 * Get current breakpoint based on viewport width
 */
export function getCurrentBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.wide) return 'wide'
  if (width >= BREAKPOINTS.desktop) return 'desktop'
  if (width >= BREAKPOINTS.tablet) return 'tablet'
  return 'mobile'
}

/**
 * Check if current viewport matches breakpoint
 */
export function isBreakpoint(width: number, breakpoint: Breakpoint): boolean {
  switch (breakpoint) {
    case 'mobile': return width < BREAKPOINTS.tablet
    case 'tablet': return width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop
    case 'desktop': return width >= BREAKPOINTS.desktop && width < BREAKPOINTS.wide
    case 'wide': return width >= BREAKPOINTS.wide
    default: return false
  }
}

/**
 * Get responsive value based on breakpoint
 */
export function getResponsiveValue<T>(
  breakpoint: Breakpoint,
  values: Partial<Record<Breakpoint, T>> & { default: T }
): T {
  return values[breakpoint] ?? values.default
}

/**
 * Create responsive class names
 */
export function createResponsiveClasses(
  baseClass: string,
  responsiveMods: Partial<Record<Breakpoint, string>>
): string {
  const classes = [baseClass]

  Object.entries(responsiveMods).forEach(([breakpoint, modifier]) => {
    classes.push(`${baseClass}--${breakpoint}-${modifier}`)
  })

  return classes.join(' ')
}

/**
 * Calculate responsive font size
 */
export function calculateResponsiveFontSize(
  minWidth: number,
  maxWidth: number,
  minSize: number,
  maxSize: number,
  currentWidth: number
): number {
  const clampedWidth = Math.max(minWidth, Math.min(maxWidth, currentWidth))
  const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
  return minSize + (maxSize - minSize) * ratio
}

/**
 * Get responsive spacing value
 */
export function getResponsiveSpacing(
  baseSpacing: number,
  breakpoint: Breakpoint,
  multipliers: Partial<Record<Breakpoint, number>> = {}
): number {
  const multiplier = multipliers[breakpoint] ?? 1
  return baseSpacing * multiplier
}

/**
 * Hook for responsive values (can be moved to hooks directory)
 */
export function useResponsiveValue<T>(
  values: Record<Breakpoint, T>
): T {
  // This would use viewport width from context/state
  const width = typeof window !== 'undefined' ? window.innerWidth : BREAKPOINTS.desktop
  const breakpoint = getCurrentBreakpoint(width)
  return values[breakpoint]
}

/**
 * Generate responsive grid columns
 */
export function getResponsiveGridColumns(breakpoint: Breakpoint): number {
  switch (breakpoint) {
    case 'mobile': return 1
    case 'tablet': return 2
    case 'desktop': return 3
    case 'wide': return 4
    default: return 1
  }
}

/**
 * Check if device is touch-enabled
 */
export function isTouchDevice(): boolean {
  return typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
}

/**
 * Get optimal image size for current viewport
 */
export function getOptimalImageSize(width: number): number {
  if (width <= BREAKPOINTS.mobile) return 480
  if (width <= BREAKPOINTS.tablet) return 768
  if (width <= BREAKPOINTS.desktop) return 1024
  return 1440
}
