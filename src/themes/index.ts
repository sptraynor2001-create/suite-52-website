/**
 * Unified Theme System
 * Single source of truth for all design tokens and styling utilities
 */

// Core design tokens
export * from './colors'
export * from './typography'
export * from './spacing'
export * from './animations'

// Design token helpers (from shared/styles)
export * from './tokens'

// Component style utilities (from shared/styles)
export * from './components'

// Layout utilities (from shared/styles)
export * from './layout'

// Responsive utilities (from shared/styles)
export * from './responsive'

// Backwards compatibility exports
export const activeTheme = themes.default
export const activeFont = fonts.primary

// Re-export commonly used items for convenience
export {
  colors,
  componentColors,
  themes,
  fonts,
  textStyles,
  fontSizes,
  lineHeights,
  letterSpacing,
  spacing,
  spacingScale,
  spacingUtils,
  animations,
  animationUtils,
  colorTokens,
  typographyTokens,
  spacingTokens,
  borderRadiusTokens,
  shadowTokens,
  zIndexTokens,
  breakpointTokens,
  getCardStyles,
  getButtonStyles,
  getInputStyles,
  getTextStyles,
  getContainerStyles,
  getFlexStyles,
  getGridStyles,
  flex,
  position,
  zIndex,
  media,
  responsiveValue,
  createResponsiveStyles,
  responsiveSpacing,
  responsiveTypography,
  keyframes,
  timing,
  duration,
  animationPresets,
  getAnimationDelay,
  createStaggeredAnimation,
  injectKeyframes,
  prefersReducedMotion,
  safeAnimation
}
