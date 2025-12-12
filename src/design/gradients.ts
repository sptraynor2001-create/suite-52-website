/**
 * Design System - Gradients
 * Suite 52: Grayscale + Red Accent System
 */

export const gradients = {
  // Void gradients - Deep black
  void: {
    vertical: 'linear-gradient(to bottom, #000000, #0a0a0a, #000000)',
    horizontal: 'linear-gradient(to right, #000000, #0a0a0a, #000000)',
    radial: 'radial-gradient(circle at center, #0a0a0a, #000000)',
    vignette: 'radial-gradient(ellipse at center, transparent 0%, #000000 100%)',
  },

  // Abyss gradients - With subtle depth
  abyss: {
    vertical: 'linear-gradient(to bottom, #000000, #1a1a1a, #000000)',
    horizontal: 'linear-gradient(to right, #000000, #1a1a1a, #000000)',
    diagonal: 'linear-gradient(135deg, #000000, #1a1a1a, #000000)',
  },

  // Red accent gradients
  blood: {
    solid: 'linear-gradient(135deg, #8b2635, #e63946)',
    glow: 'radial-gradient(ellipse at center, rgba(230, 57, 70, 0.4) 0%, transparent 70%)',
    radial: 'radial-gradient(circle at center, #e63946, #8b2635)',
    soft: 'linear-gradient(135deg, rgba(230, 57, 70, 0.2), rgba(139, 38, 53, 0.1))',
    ember: 'linear-gradient(135deg, #e63946, #ff6b6b)',
  },

  // Portal gradients - for 3D portal effects
  portal: {
    ring: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
    glow: 'radial-gradient(ellipse at center, rgba(230, 57, 70, 0.6) 0%, rgba(230, 57, 70, 0.2) 30%, transparent 70%)',
    core: 'radial-gradient(circle at center, #ff6b6b, #e63946, transparent)',
    ambient: 'radial-gradient(ellipse at center, rgba(230, 57, 70, 0.1) 0%, transparent 50%)',
  },

  // Subtle white/gray gradients
  subtle: {
    white: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02))',
    gray: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent)',
    silver: 'linear-gradient(135deg, rgba(212, 212, 212, 0.1), rgba(138, 138, 138, 0.05))',
  },

  // Card backgrounds - glass morphism
  card: {
    default: 'linear-gradient(135deg, rgba(26, 26, 26, 0.6), rgba(10, 10, 10, 0.8))',
    hover: 'linear-gradient(135deg, rgba(42, 42, 42, 0.7), rgba(26, 26, 26, 0.9))',
    elevated: 'linear-gradient(135deg, rgba(42, 42, 42, 0.8), rgba(10, 10, 10, 0.95))',
    accent: 'linear-gradient(135deg, rgba(230, 57, 70, 0.05), rgba(26, 26, 26, 0.8))',
  },

  // Overlay gradients
  overlay: {
    top: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent)',
    bottom: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
    full: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.95))',
    spotlight: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)',
  },

  // Mesh gradient for atmospheric backgrounds
  mesh: {
    default: 'radial-gradient(at 20% 30%, rgba(42, 42, 42, 0.2) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(58, 58, 58, 0.1) 0px, transparent 50%)',
    withRed: 'radial-gradient(at 20% 30%, rgba(42, 42, 42, 0.2) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(230, 57, 70, 0.05) 0px, transparent 50%)',
    particles: 'radial-gradient(at 50% 50%, rgba(255, 255, 255, 0.02) 0px, transparent 30%)',
  },

  // Button gradients
  button: {
    primary: 'linear-gradient(135deg, #e63946, #ff6b6b)',
    primaryHover: 'linear-gradient(135deg, #ff6b6b, #ff8585)',
    secondary: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
    ghost: 'linear-gradient(135deg, transparent, transparent)',
  },

  // Text gradients
  text: {
    white: 'linear-gradient(135deg, #ffffff, #d4d4d4)',
    silver: 'linear-gradient(135deg, #d4d4d4, #8a8a8a)',
    red: 'linear-gradient(135deg, #ff6b6b, #e63946)',
    redGlow: 'linear-gradient(135deg, #ff8585, #e63946, #8b2635)',
  },

  // 3D Scene gradients (CSS for backgrounds, not Three.js materials)
  scene: {
    fog: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)',
    depth: 'linear-gradient(to bottom, rgba(10, 10, 10, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%)',
    atmosphere: 'radial-gradient(ellipse at 50% 30%, rgba(230, 57, 70, 0.03) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(0, 0, 0, 0.5) 0%, transparent 50%)',
  },
} as const

export type GradientPalette = typeof gradients

// Helper function to apply gradient as background
export const applyGradient = (gradient: string) => ({
  backgroundImage: gradient,
})

// Helper to combine multiple gradients
export const combineGradients = (...grads: string[]) => grads.join(', ')
