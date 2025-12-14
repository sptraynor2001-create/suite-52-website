/**
 * Breakpoint system - Responsive design breakpoints
 * Centralized breakpoint values for consistent responsive behavior
 */

export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1920,
} as const

export type Breakpoint = keyof typeof breakpoints

// Helper functions for responsive checks
export const mediaQueries = {
  mobile: `(max-width: ${breakpoints.mobile}px)`,
  tablet: `(max-width: ${breakpoints.tablet}px)`,
  desktop: `(min-width: ${breakpoints.desktop}px)`,
  wide: `(min-width: ${breakpoints.wide}px)`,
} as const

// Utility function to check if viewport is mobile
export const isMobileViewport = (width: number): boolean => {
  return width < breakpoints.tablet
}

// Utility function to check if viewport is tablet
export const isTabletViewport = (width: number): boolean => {
  return width >= breakpoints.tablet && width < breakpoints.desktop
}

// Utility function to check if viewport is desktop
export const isDesktopViewport = (width: number): boolean => {
  return width >= breakpoints.desktop
}

