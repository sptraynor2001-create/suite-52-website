/**
 * Color system - Suite 52: Where Nature Meets the Machine
 * Grayscale foundation with red accents
 */

// Base colors - Atmospheric naming
export const colors = {
  // Core brand colors
  brand: {
    primary: '#e63946', // blood - Poker red
    secondary: '#ffffff', // white
    accent: '#ff6b6b', // ember - hover/glow
  },

  // Atmospheric grayscale
  atmosphere: {
    void: '#000000',      // Deep backgrounds
    carbon: '#0a0a0a',    // Elevated surfaces
    ash: '#1a1a1a',       // Cards, containers
    smoke: '#2a2a2a',     // Borders, dividers
    charcoal: '#3a3a3a',  // Subtle highlights
    fog: '#4a4a4a',       // Muted text
    slate: '#6a6a6a',     // Disabled states
    silver: '#8a8a8a',    // Secondary text
    cloud: '#b4b4b4',     // Tertiary text
    bone: '#d4d4d4',      // Primary text
    snow: '#ebebeb',      // Light highlights
    white: '#ffffff',     // Pure white
  },

  // Red accent spectrum
  red: {
    rust: '#8b2635',      // Dark accent
    blood: '#e63946',     // Primary
    ember: '#ff6b6b',     // Hover
    flame: '#ff8585',     // Light
    blush: '#ffb3b3',     // Subtle
  },

  // Legacy neutral colors
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

  // Semantic colors (grayscale for subtlety, red for alerts)
  semantic: {
    success: '#8a8a8a',
    warning: '#ff6b6b',
    error: '#e63946',
    info: '#d4d4d4',
  },

  // Social platform colors
  social: {
    spotify: '#1db954',
    soundcloud: '#ff5500',
    youtube: '#ff0000',
    apple: '#000000',
    instagram: '#e4405f',
  },

  // 3D Scene colors (hex integers for Three.js)
  scene: {
    background: 0x000000,
    fog: 0x0a0a0a,
    ambient: 0x1a1a1a,
    particleOrganic: 0xffffff,
    particleDigital: 0xe63946,
    portalRing: 0xffffff,
    portalGlow: 0xe63946,
    portalCore: 0xff6b6b,
  },
} as const

// Component-specific color mappings
export const componentColors = {
  button: {
    primary: {
      bg: colors.brand.primary,
      text: colors.brand.secondary,
      hover: colors.red.ember,
      shadow: 'rgba(230, 57, 70, 0.3)',
    },
    secondary: {
      bg: 'transparent',
      text: colors.brand.secondary,
      border: 'rgba(255, 255, 255, 0.2)',
      hover: 'rgba(255, 255, 255, 0.1)',
    },
    ghost: {
      bg: 'transparent',
      text: 'rgba(255, 255, 255, 0.8)',
      hover: 'rgba(255, 255, 255, 0.05)',
    },
  },

  navigation: {
    background: 'rgba(0, 0, 0, 0.9)',
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
    background: 'rgba(26, 26, 26, 0.6)',
    backgroundHover: 'rgba(42, 42, 42, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(255, 255, 255, 0.25)',
    shadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
  },

  text: {
    primary: colors.brand.secondary,
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.4)',
    accent: colors.brand.primary,
  },

  glow: {
    white: {
      subtle: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
      strong: 'rgba(255, 255, 255, 0.4)',
    },
    red: {
      subtle: 'rgba(230, 57, 70, 0.2)',
      medium: 'rgba(230, 57, 70, 0.4)',
      strong: 'rgba(230, 57, 70, 0.6)',
      intense: 'rgba(230, 57, 70, 0.8)',
    },
  },
} as const

// Theme variants
export const themes = {
  default: {
    name: 'default',
    colors: colors,
    componentColors: componentColors,
  },
} as const

export type ThemeName = keyof typeof themes
