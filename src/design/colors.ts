/**
 * Design System - Color Palette
 * GRAYSCALE MODE - Development phase
 * 
 * Note: Color palette preserved in comments for easy restoration
 */

export const colors = {
  // Grayscale - Pure blacks to whites
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

  // Black scale
  black: {
    50: '#000000',
    100: '#0a0a0a',
    200: '#141414',
    300: '#1a1a1a',
    400: '#1f1f1f',
    500: '#262626',  // Base black
    600: '#2e2e2e',
    700: '#3d3d3d',
    800: '#4a4a4a',
    900: '#5a5a5a',
  },

  // Accent - Subtle gray highlights
  accent: {
    light: '#e5e5e5',   // Subtle highlight
    medium: '#a3a3a3',  // Medium accent
    dark: '#525252',    // Dark accent
  },

  // Semantic colors (grayscale)
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.8)',
    tertiary: 'rgba(255, 255, 255, 0.6)',
    muted: 'rgba(255, 255, 255, 0.4)',
    inverse: '#000000',
  },

  // Background layers
  background: {
    base: '#000000',
    elevated: '#0a0a0a',
    card: 'rgba(38, 38, 38, 0.3)',
    cardHover: 'rgba(38, 38, 38, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },

  // Borders
  border: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    default: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.2)',
    highlight: '#ffffff',
  },

  // Status colors (grayscale)
  status: {
    success: '#a3a3a3',
    warning: '#737373',
    error: '#525252',
    info: '#d4d4d4',
  },
} as const

/* 
 * COLOR PALETTE (PRESERVED FOR RESTORATION)
 * 
 * midnight: {
 *   50: '#0a0e1a',
 *   500: '#252f4f',
 *   900: '#3f4b7d',
 * },
 * 
 * neon: {
 *   cyan: '#00f3ff',
 *   blue: '#0088ff',
 *   purple: '#8b5cf6',
 *   pink: '#ec4899',
 *   green: '#10b981',
 * },
 */

export type ColorPalette = typeof colors
