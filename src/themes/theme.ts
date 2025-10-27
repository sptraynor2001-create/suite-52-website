/**
 * Theme utilities and configuration
 * Combines design tokens with theme-aware functions
 */

import { colors, componentColors, themes } from './colors'
import { spacingTokens } from './tokens'
import { borderRadiusTokens } from './tokens'
import { shadowTokens } from './tokens'
import { typographyTokens } from './tokens'

// Re-export themes for easier access
export { colors, componentColors, themes }

// Theme type definitions
export type ThemeName = keyof typeof themes

// Current theme (could be made dynamic later)
export const currentTheme = themes.default

/**
 * Get theme-aware color value
 */
export function getColor(colorPath: string): string {
  return colorPath.split('.').reduce((obj, key) => obj?.[key], currentTheme.colors) as string
}

/**
 * Get component-specific color
 */
export function getComponentColor(component: string, variant: string, property: string): string {
  return currentTheme.componentColors[component]?.[variant]?.[property] || ''
}

/**
 * Theme-aware spacing system (using tokens)
 */
export const spacing = spacingTokens

/**
 * Theme-aware border radius (using tokens)
 */
export const borderRadius = borderRadiusTokens

/**
 * Theme-aware shadows (using tokens)
 */
export const shadows = shadowTokens

/**
 * Typography scale (using tokens)
 */
export const typography = typographyTokens
