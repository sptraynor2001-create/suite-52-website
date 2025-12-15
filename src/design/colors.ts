/**
 * Design System - Color Palette
 * SUITE 52: Where Nature Meets the Machine
 * 
 * Grayscale foundation with red accents
 * 
 * NOTE: This file re-exports from @/themes/colors for consistency.
 * All color definitions are in @/themes/colors.ts
 */

// Re-export from themes (single source of truth)
import { colors as themeColors, componentColors as themeComponentColors } from '@/themes/colors'

// Create backwards-compatible flat structure for design/colors
export const colors = {
  // Core grayscale palette - mapped from themes
  void: themeColors.atmosphere.void,
  carbon: themeColors.atmosphere.carbon,
  ash: themeColors.atmosphere.ash,
  smoke: themeColors.atmosphere.smoke,
  charcoal: themeColors.atmosphere.charcoal,
  fog: themeColors.atmosphere.fog,
  slate: themeColors.atmosphere.slate,
  silver: themeColors.atmosphere.silver,
  cloud: themeColors.atmosphere.cloud,
  bone: themeColors.atmosphere.bone,
  snow: themeColors.atmosphere.snow,
  white: themeColors.atmosphere.white,

  // Red accent palette - mapped from themes
  rust: themeColors.red.rust,
  blood: themeColors.red.blood,
  ember: themeColors.red.ember,
  flame: themeColors.red.flame,
  blush: themeColors.red.blush,

  // Gold accent palette - mapped from themes
  gold: {
    dark: themeColors.gold.deep,
    casino: themeColors.gold.casino,
    light: themeColors.gold.light,
    subtle: themeColors.gold.shimmer,
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

  // Semantic accent mapping - mapped from themes
  accent: {
    primary: themeColors.red.blood,
    hover: themeColors.red.ember,
    dark: themeColors.red.rust,
    light: themeColors.red.flame,
    subtle: themeColors.red.blush,
    gold: themeColors.gold.casino,
  },

  // Semantic text colors
  text: {
    primary: themeColors.brand.secondary,
    secondary: 'rgba(255, 255, 255, 0.8)',
    tertiary: 'rgba(255, 255, 255, 0.6)',
    muted: 'rgba(255, 255, 255, 0.4)',
    disabled: 'rgba(255, 255, 255, 0.25)',
    inverse: '#000000',
    accent: themeColors.red.blood,
  },

  // Background layers - mapped from themes
  background: {
    base: themeColors.atmosphere.void,
    elevated: themeColors.atmosphere.carbon,
    card: themeColors.componentColors.card.background,
    cardHover: themeColors.componentColors.card.backgroundHover,
    overlay: 'rgba(0, 0, 0, 0.85)',
    glass: 'rgba(10, 10, 10, 0.7)',
  },

  // Borders - mapped from themes
  border: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    default: themeColors.componentColors.card.border,
    strong: themeColors.componentColors.card.borderHover,
    highlight: themeColors.brand.secondary,
    accent: themeColors.red.blood,
    accentSubtle: 'rgba(230, 57, 70, 0.3)',
  },

  // Glow effects - mapped from themes
  glow: {
    white: themeColors.componentColors.glow.white,
    red: themeColors.componentColors.glow.red,
    blue: themeColors.componentColors.glow.blue,
    green: themeColors.componentColors.glow.green,
    gold: themeColors.componentColors.glow.gold,
  },

  // 3D Scene colors - mapped from themes
  scene: {
    background: themeColors.scene.background,
    fog: themeColors.scene.fog,
    ambient: themeColors.scene.ambient,
    particle: {
      organic: themeColors.scene.particleOrganic,
      digital: themeColors.scene.particleDigital,
    },
    portal: {
      ring: themeColors.scene.portalRing,
      glow: themeColors.scene.portalGlow,
      core: themeColors.scene.portalCore,
    },
  },
} as const

// Re-export componentColors from themes
export const componentColors = themeComponentColors

export type ColorPalette = typeof colors
export type ComponentColors = typeof componentColors
