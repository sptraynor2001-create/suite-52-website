/**
 * Theme system index - Unified theme exports
 */

import { colors as _colors, componentColors as _componentColors, themes as _themes } from './colors'
import { fonts as _fonts, textStyles as _textStyles, fontSizes as _fontSizes, lineHeights as _lineHeights, letterSpacing as _letterSpacing } from './typography'
import { spacing as _spacing, spacingScale as _spacingScale, spacingUtils as _spacingUtils } from './spacing'
import { animations as _animations, animationUtils as _animationUtils } from './animations'

export const colors = _colors
export const componentColors = _componentColors
export const themes = _themes
export const fonts = _fonts
export const textStyles = _textStyles
export const fontSizes = _fontSizes
export const lineHeights = _lineHeights
export const letterSpacing = _letterSpacing
export const spacing = _spacing
export const spacingScale = _spacingScale
export const spacingUtils = _spacingUtils
export const animations = _animations
export const animationUtils = _animationUtils

// Active theme (could be dynamic in the future)
export const activeTheme = _themes.default

// Active font (for backwards compatibility)
export const activeFont = _fonts.primary
