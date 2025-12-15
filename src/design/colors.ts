/**
 * Design System - Color Palette
 * SUITE 52: Where Nature Meets the Machine
 * 
 * Grayscale foundation with red accents
 */

export const colors = {
  // Core grayscale palette - Named for atmosphere
  void: '#000000',      // Deep backgrounds - absolute black
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
  white: '#ffffff',     // Pure white - headlines, emphasis

  // Red accent palette - Named for intensity
  rust: '#8b2635',      // Dark accent - shadows, depth
  blood: '#e63946',     // Primary accent - POKER_RED
  ember: '#ff6b6b',     // Hover states, glows
  flame: '#ff8585',     // Light accent
  blush: '#ffb3b3',     // Subtle tints

  // Gold accent palette - Casino Royale chrome gold
  gold: {
    dark: '#B8860B',        // Dark gold
    casino: '#D4AF37',      // Casino Royale chrome gold
    light: '#F4D03F',       // Light gold
    subtle: '#FFD700',      // Bright gold
  },

  // Legacy grayscale (for backwards compatibility)
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Black scale (legacy)
  black: {
    50: '#000000',
    100: '#0a0a0a',
    200: '#141414',
    300: '#1a1a1a',
    400: '#1f1f1f',
    500: '#262626',
    600: '#2e2e2e',
    700: '#3d3d3d',
    800: '#4a4a4a',
    900: '#5a5a5a',
  },

  // Semantic accent mapping
  accent: {
    primary: '#e63946',   // blood
    hover: '#ff6b6b',     // ember
    dark: '#8b2635',      // rust
    light: '#ff8585',     // flame
    subtle: '#ffb3b3',    // blush
    gold: '#D4AF37',      // Casino Royale chrome gold
  },

  // Semantic text colors
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.8)',
    tertiary: 'rgba(255, 255, 255, 0.6)',
    muted: 'rgba(255, 255, 255, 0.4)',
    disabled: 'rgba(255, 255, 255, 0.25)',
    inverse: '#000000',
    accent: '#e63946',
  },

  // Background layers
  background: {
    base: '#000000',
    elevated: '#0a0a0a',
    card: 'rgba(26, 26, 26, 0.6)',
    cardHover: 'rgba(42, 42, 42, 0.8)',
    overlay: 'rgba(0, 0, 0, 0.85)',
    glass: 'rgba(10, 10, 10, 0.7)',
  },

  // Borders
  border: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    default: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.2)',
    highlight: '#ffffff',
    accent: '#e63946',
    accentSubtle: 'rgba(230, 57, 70, 0.3)',
  },

  // Glow effects for 3D elements
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

  // 3D Scene colors (for Three.js)
  scene: {
    background: 0x000000,
    fog: 0x0a0a0a,
    ambient: 0x1a1a1a,
    particle: {
      organic: 0xffffff,
      digital: 0xe63946,
    },
    portal: {
      ring: 0xffffff,
      glow: 0xe63946,
      core: 0xff6b6b,
    },
  },
} as const

// Component-specific color mappings
export const componentColors = {
  card: {
    background: 'rgba(26, 26, 26, 0.6)',
    backgroundHover: 'rgba(42, 42, 42, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(255, 255, 255, 0.25)',
    shadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
  },
  button: {
    primary: {
      background: '#e63946',
      backgroundHover: '#ff6b6b',
      text: '#ffffff',
      border: 'transparent',
    },
    secondary: {
      background: 'transparent',
      backgroundHover: 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      border: 'rgba(255, 255, 255, 0.2)',
    },
    ghost: {
      background: 'transparent',
      backgroundHover: 'rgba(255, 255, 255, 0.05)',
      text: 'rgba(255, 255, 255, 0.8)',
      border: 'transparent',
    },
  },
  navigation: {
    background: 'rgba(0, 0, 0, 0.9)',
    text: '#ffffff',
    textActive: '#e63946',
    textHover: 'rgba(255, 255, 255, 0.8)',
    indicator: '#e63946',
  },
  input: {
    background: 'rgba(26, 26, 26, 0.6)',
    backgroundFocus: 'rgba(42, 42, 42, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderFocus: '#e63946',
    text: '#ffffff',
    placeholder: 'rgba(255, 255, 255, 0.4)',
  },
}

export type ColorPalette = typeof colors
export type ComponentColors = typeof componentColors
