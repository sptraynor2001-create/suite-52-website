import { BREAKPOINTS, getCurrentBreakpoint } from '../utils/responsive'

/**
 * Responsive style utilities for breakpoints and media queries
 */

/**
 * Media query helpers
 */
export const media = {
  mobile: `@media (max-width: ${BREAKPOINTS.tablet - 1}px)`,
  tablet: `@media (min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
  desktop: `@media (min-width: ${BREAKPOINTS.desktop}px)`,
  wide: `@media (min-width: ${BREAKPOINTS.wide}px)`,

  // Utility queries
  mobileOnly: `@media (max-width: ${BREAKPOINTS.tablet - 1}px)`,
  tabletUp: `@media (min-width: ${BREAKPOINTS.tablet}px)`,
  tabletDown: `@media (max-width: ${BREAKPOINTS.desktop - 1}px)`,
  desktopUp: `@media (min-width: ${BREAKPOINTS.desktop}px)`,
}

/**
 * Responsive value selectors
 */
export function responsiveValue<T>(
  values: Partial<Record<'mobile' | 'tablet' | 'desktop' | 'wide', T>> & { default: T }
): T {
  const breakpoint = getCurrentBreakpoint(window.innerWidth)
  return values[breakpoint] ?? values.default
}

/**
 * Create responsive styles object
 */
export function createResponsiveStyles<T extends Record<string, any>>(
  styles: T
): T & { [K: string]: any } {
  const responsiveStyles = { ...styles }

  // Add media query styles
  Object.keys(media).forEach(key => {
    if (styles[key as keyof T]) {
      responsiveStyles[media[key as keyof typeof media]] = styles[key as keyof T]
    }
  })

  return responsiveStyles
}

/**
 * Responsive spacing utilities
 */
export const responsiveSpacing = {
  page: {
    paddingLeft: '20px',
    paddingRight: '20px',
    [media.tablet]: {
      paddingLeft: '32px',
      paddingRight: '32px',
    },
    [media.desktop]: {
      paddingLeft: '40px',
      paddingRight: '40px',
    },
  },

  container: {
    maxWidth: '100%',
    [media.mobile]: {
      maxWidth: '100%',
    },
    [media.tablet]: {
      maxWidth: '768px',
    },
    [media.desktop]: {
      maxWidth: '1024px',
    },
    [media.wide]: {
      maxWidth: '1200px',
    },
  },
}

/**
 * Responsive typography
 */
export const responsiveTypography = {
  title: {
    fontSize: '2rem',
    [media.tablet]: {
      fontSize: '2.5rem',
    },
    [media.desktop]: {
      fontSize: '3rem',
    },
  },

  subtitle: {
    fontSize: '0.875rem',
    [media.tablet]: {
      fontSize: '1rem',
    },
    [media.desktop]: {
      fontSize: '1.125rem',
    },
  },
}
