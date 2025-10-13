/**
 * Design System - Gradients
 * GRAYSCALE MODE - Development phase
 */

export const gradients = {
  // Primary gradients - Black to gray
  midnight: {
    vertical: 'linear-gradient(to bottom, #000000, #262626, #000000)',
    horizontal: 'linear-gradient(to right, #000000, #262626, #000000)',
    diagonal: 'linear-gradient(135deg, #000000, #262626, #000000)',
  },

  // Abyss - Pure black gradients
  abyss: {
    vertical: 'linear-gradient(to bottom, #000000, #0a0a0a, #000000)',
    horizontal: 'linear-gradient(to right, #000000, #0a0a0a, #000000)',
    radial: 'radial-gradient(circle at center, #0a0a0a, #000000)',
  },

  // Subtle gray gradients
  neon: {
    blue: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
    purple: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
    cyan: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05))',
  },

  // Card backgrounds
  card: {
    default: 'linear-gradient(135deg, rgba(38, 38, 38, 0.2), rgba(10, 10, 10, 0.4))',
    hover: 'linear-gradient(135deg, rgba(38, 38, 38, 0.4), rgba(10, 10, 10, 0.6))',
    elevated: 'linear-gradient(135deg, rgba(38, 38, 38, 0.5), rgba(10, 10, 10, 0.8))',
  },

  // Overlay gradients
  overlay: {
    top: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent)',
    bottom: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
    full: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9))',
  },

  // Mesh gradient for background
  mesh: 'radial-gradient(at 20% 30%, rgba(38, 38, 38, 0.2) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(82, 82, 82, 0.1) 0px, transparent 50%), radial-gradient(at 40% 80%, rgba(163, 163, 163, 0.05) 0px, transparent 50%)',

  // Button gradients
  button: {
    primary: 'linear-gradient(135deg, #525252, #737373)',
    secondary: 'linear-gradient(135deg, #262626, #1a1a1a)',
    danger: 'linear-gradient(135deg, #404040, #262626)',
    ghost: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
  },

  // Text gradients
  text: {
    neon: 'linear-gradient(135deg, #ffffff, #d4d4d4)',
    purple: 'linear-gradient(135deg, #e5e5e5, #a3a3a3)',
    rainbow: 'linear-gradient(135deg, #ffffff, #d4d4d4, #a3a3a3, #737373)',
  },
} as const

export type GradientPalette = typeof gradients

// Helper function to apply gradient as background
export const applyGradient = (gradient: string) => ({
  backgroundImage: gradient,
})

/* 
 * COLOR GRADIENTS (PRESERVED FOR RESTORATION)
 * 
 * midnight: linear-gradient(to bottom, #000000, #252f4f, #000000)
 * neon.blue: linear-gradient(135deg, rgba(0, 136, 255, 0.3), rgba(0, 243, 255, 0.1))
 * button.primary: linear-gradient(135deg, #0088ff, #00f3ff)
 */
