/**
 * Design System - Color Palette
 * Midnight blue to black gradient aesthetic
 * Ominous, futuristic, technical
 */

export const colors = {
  // Primary - Deep midnight blues
  midnight: {
    50: '#0a0e1a',
    100: '#0f1420',
    200: '#141a2e',
    300: '#1a2138',
    400: '#1f2843',
    500: '#252f4f',  // Base midnight
    600: '#2b365a',
    700: '#323d66',
    800: '#384471',
    900: '#3f4b7d',
  },

  // Abyss - True blacks with blue tint
  abyss: {
    50: '#000000',
    100: '#010203',
    200: '#020406',
    300: '#030609',
    400: '#04080c',
    500: '#05090e',  // Base abyss
    600: '#060b11',
    700: '#070d14',
    800: '#080f17',
    900: '#09111a',
  },

  // Neon - Electric accents for tech feel
  neon: {
    cyan: '#00f3ff',      // Electric cyan
    blue: '#0088ff',      // Vibrant blue
    purple: '#8b5cf6',    // Deep purple
    pink: '#ec4899',      // Sharp pink
    green: '#10b981',     // Matrix green
  },

  // Glow - Subtle illumination
  glow: {
    blue: {
      dim: 'rgba(0, 136, 255, 0.1)',
      medium: 'rgba(0, 136, 255, 0.2)',
      bright: 'rgba(0, 136, 255, 0.4)',
    },
    cyan: {
      dim: 'rgba(0, 243, 255, 0.1)',
      medium: 'rgba(0, 243, 255, 0.2)',
      bright: 'rgba(0, 243, 255, 0.4)',
    },
  },

  // Neutral - Technical grays
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Status colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0088ff',
  },

  // Semantic colors
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
    elevated: '#05090e',
    card: 'rgba(37, 47, 79, 0.3)',
    cardHover: 'rgba(37, 47, 79, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },

  // Borders
  border: {
    subtle: 'rgba(0, 136, 255, 0.1)',
    default: 'rgba(0, 136, 255, 0.2)',
    strong: 'rgba(0, 136, 255, 0.4)',
    neon: '#00f3ff',
  },
} as const

export type ColorPalette = typeof colors

