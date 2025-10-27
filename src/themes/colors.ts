/**
 * Color system - Granular color definitions
 */

// Base colors
export const colors = {
  // Core brand colors
  brand: {
    primary: '#e63946', // Poker red
    secondary: '#ffffff', // White
  },

  // Neutral colors
  neutral: {
    black: '#000000',
    white: '#ffffff',
    gray: {
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

// Component-specific color mappings
export const componentColors = {
  button: {
    primary: {
      bg: colors.brand.primary,
      text: colors.brand.secondary,
      hover: '#d32f3f', // Darker red
    },
    secondary: {
      bg: 'transparent',
      text: colors.brand.secondary,
      border: colors.neutral.gray[600],
      hover: colors.neutral.gray[700],
    },
  },

  navigation: {
    normal: {
      text: colors.brand.secondary,
      underline: 'transparent',
    },
    hover: {
      text: colors.brand.secondary,
      underline: colors.brand.secondary,
    },
    active: {
      text: colors.brand.primary,
      weight: 'italic',
    },
  },

  card: {
    background: 'transparent',
    shadow: 'rgba(0, 0, 0, 0.3)',
    border: 'rgba(255, 255, 255, 0.2)',
  },

  text: {
    primary: colors.brand.secondary,
    secondary: colors.neutral.gray[400],
    muted: colors.neutral.gray[500],
  },
} as const

// Theme variants (for future dark mode, etc.)
export const themes = {
  default: {
    name: 'default',
    colors: colors,
    componentColors: componentColors,
  },
} as const

export type ThemeName = keyof typeof themes
