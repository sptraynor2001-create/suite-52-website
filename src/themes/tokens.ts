/**
 * Design tokens - centralized values for consistent theming
 * These are the atomic values that everything else is built on
 */

// Color tokens
export const colorTokens = {
  // Brand colors
  brand: {
    primary: '#e63946', // Poker red
    secondary: '#ffffff', // White
  },

  // Neutral grays
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Semantic colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Social platform colors
  social: {
    spotify: '#1db954',
    soundcloud: '#ff5500',
    youtube: '#ff0000',
    apple: '#000000',
    instagram: '#e4405f',
  },
} as const

// Typography tokens
export const typographyTokens = {
  fontFamily: {
    primary: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    secondary: 'system-ui, -apple-system, sans-serif',
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },

  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const

// Spacing tokens (using t-shirt sizing)
export const spacingTokens = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
} as const

// Border radius tokens
export const borderRadiusTokens = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const

// Shadow tokens
export const shadowTokens = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const

// Z-index scale
export const zIndexTokens = {
  base: 1,
  dropdown: 10,
  sticky: 50,
  fixed: 100,
  modal: 200,
  popover: 300,
  tooltip: 400,
  toast: 500,
} as const

// Breakpoint tokens
export const breakpointTokens = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
} as const

/**
 * Helper function to get CSS custom property value
 */
export function cssVar(name: string): string {
  return `var(--${name})`
}

/**
 * Create CSS custom properties from tokens
 */
export function createCssVariables(tokens: Record<string, any>, prefix = ''): Record<string, string> {
  const variables: Record<string, string> = {}

  function flatten(obj: any, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key]
      const varName = prefix + currentPath.join('-')

      if (typeof value === 'object' && value !== null) {
        flatten(value, currentPath)
      } else {
        variables[varName] = value as string
      }
    }
  }

  flatten(tokens)
  return variables
}
