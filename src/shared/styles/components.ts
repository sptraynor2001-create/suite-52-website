import { componentColors } from './theme'
import { spacing, borderRadius, shadows, typography } from './theme'

/**
 * Reusable component style builders
 * These functions generate consistent styling for common UI patterns
 */

/**
 * Base card styles with consistent theming
 */
export function getCardStyles(variant: 'default' | 'elevated' | 'bordered' = 'default') {
  const base = {
    backgroundColor: componentColors.card.background,
    borderRadius: borderRadius.xl,
    border: `1px solid ${componentColors.card.border}`,
    boxShadow: componentColors.card.shadow,
  }

  switch (variant) {
    case 'elevated':
      return {
        ...base,
        boxShadow: shadows.lg,
      }
    case 'bordered':
      return {
        ...base,
        border: `2px solid ${componentColors.card.border}`,
        boxShadow: 'none',
      }
    default:
      return base
  }
}

/**
 * Button style variants
 */
export function getButtonStyles(variant: 'primary' | 'secondary' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') {
  const base = {
    border: 'none',
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.15s ease-out',
    fontFamily: 'inherit',
  }

  const sizes = {
    sm: {
      padding: `${spacing.xs} ${spacing.sm}`,
      fontSize: typography.fontSize.sm,
    },
    md: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.base,
    },
    lg: {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: typography.fontSize.lg,
    },
  }

  const variants = {
    primary: {
      backgroundColor: componentColors.button.primary.bg,
      color: componentColors.button.primary.text,
      '&:hover': {
        backgroundColor: componentColors.button.primary.hover,
      },
    },
    secondary: {
      backgroundColor: componentColors.button.secondary.bg,
      color: componentColors.button.secondary.text,
      border: `1px solid ${componentColors.button.secondary.border}`,
      '&:hover': {
        backgroundColor: componentColors.button.secondary.hover,
      },
    },
  }

  return {
    ...base,
    ...sizes[size],
    ...variants[variant],
  }
}

/**
 * Input field styles
 */
export function getInputStyles(size: 'sm' | 'md' | 'lg' = 'md') {
  const base = {
    border: `1px solid ${componentColors.card.border}`,
    borderRadius: borderRadius.md,
    backgroundColor: componentColors.card.background,
    color: componentColors.text.primary,
    fontFamily: 'inherit',
    transition: 'border-color 0.15s ease-out, box-shadow 0.15s ease-out',
    '&:focus': {
      outline: 'none',
      borderColor: componentColors.button.primary.bg,
      boxShadow: `0 0 0 3px rgba(230, 57, 70, 0.1)`,
    },
  }

  const sizes = {
    sm: {
      padding: `${spacing.xs} ${spacing.sm}`,
      fontSize: typography.fontSize.sm,
    },
    md: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.base,
    },
    lg: {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: typography.fontSize.lg,
    },
  }

  return {
    ...base,
    ...sizes[size],
  }
}

/**
 * Container styles for consistent layouts
 */
export function getContainerStyles(maxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'lg') {
  const maxWidths = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%',
  }

  return {
    width: '100%',
    maxWidth: maxWidths[maxWidth],
    margin: '0 auto',
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  }
}

/**
 * Flex utility styles
 */
export function getFlexStyles(
  direction: 'row' | 'column' = 'row',
  justify: 'start' | 'center' | 'end' | 'between' | 'around' = 'start',
  align: 'start' | 'center' | 'end' | 'stretch' = 'center',
  gap: keyof typeof spacing = 'md'
) {
  const justifyContent = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
  }

  const alignItems = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  }

  return {
    display: 'flex',
    flexDirection: direction,
    justifyContent: justifyContent[justify],
    alignItems: alignItems[align],
    gap: spacing[gap],
  }
}

/**
 * Text utility styles
 */
export function getTextStyles(
  size: keyof typeof typography.fontSize = 'base',
  weight: keyof typeof typography.fontWeight = 'normal',
  color: 'primary' | 'secondary' | 'muted' = 'primary'
) {
  const colors = {
    primary: componentColors.text.primary,
    secondary: componentColors.text.secondary,
    muted: componentColors.text.muted,
  }

  return {
    fontSize: typography.fontSize[size],
    fontWeight: typography.fontWeight[weight],
    color: colors[color],
    lineHeight: typography.lineHeight.normal,
  }
}
