/**
 * Design System - Gradients
 * Ominous midnight-to-black gradients for futuristic atmosphere
 */

export const gradients = {
  // Primary gradients
  midnight: {
    vertical: 'linear-gradient(to bottom, #000000, #252f4f, #000000)',
    horizontal: 'linear-gradient(to right, #000000, #252f4f, #000000)',
    diagonal: 'linear-gradient(135deg, #000000, #252f4f, #000000)',
  },

  // Abyss - Deep black with subtle blue
  abyss: {
    vertical: 'linear-gradient(to bottom, #000000, #05090e, #000000)',
    horizontal: 'linear-gradient(to right, #000000, #05090e, #000000)',
    radial: 'radial-gradient(circle at center, #05090e, #000000)',
  },

  // Neon glow gradients
  neon: {
    blue: 'linear-gradient(135deg, rgba(0, 136, 255, 0.3), rgba(0, 243, 255, 0.1))',
    purple: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.1))',
    cyan: 'linear-gradient(135deg, rgba(0, 243, 255, 0.3), rgba(16, 185, 129, 0.1))',
  },

  // Card backgrounds
  card: {
    default: 'linear-gradient(135deg, rgba(37, 47, 79, 0.2), rgba(5, 9, 14, 0.4))',
    hover: 'linear-gradient(135deg, rgba(37, 47, 79, 0.4), rgba(5, 9, 14, 0.6))',
    elevated: 'linear-gradient(135deg, rgba(37, 47, 79, 0.5), rgba(5, 9, 14, 0.8))',
  },

  // Overlay gradients
  overlay: {
    top: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent)',
    bottom: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
    full: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9))',
  },

  // Mesh gradient for background
  mesh: 'radial-gradient(at 20% 30%, rgba(37, 47, 79, 0.3) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(0, 136, 255, 0.15) 0px, transparent 50%), radial-gradient(at 40% 80%, rgba(0, 243, 255, 0.1) 0px, transparent 50%)',

  // Button gradients
  button: {
    primary: 'linear-gradient(135deg, #0088ff, #00f3ff)',
    secondary: 'linear-gradient(135deg, #252f4f, #1a2138)',
    danger: 'linear-gradient(135deg, #ef4444, #dc2626)',
    ghost: 'linear-gradient(135deg, rgba(0, 136, 255, 0.1), rgba(0, 243, 255, 0.05))',
  },

  // Text gradients
  text: {
    neon: 'linear-gradient(135deg, #00f3ff, #0088ff)',
    purple: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    rainbow: 'linear-gradient(135deg, #00f3ff, #0088ff, #8b5cf6, #ec4899)',
  },
} as const

export type GradientPalette = typeof gradients

// Helper function to apply gradient as background
export const applyGradient = (gradient: string) => ({
  backgroundImage: gradient,
})

