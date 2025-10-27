import { spacing } from './theme'

/**
 * Layout utility functions for consistent spacing and positioning
 */

/**
 * Page layout containers
 */
export const layout = {
  page: {
    paddingTop: '100px', // Account for fixed navigation
    paddingBottom: '60px',
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    position: 'relative' as const,
  },

  container: {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative' as const,
    zIndex: 1,
  },

  content: {
    marginTop: '170px', // Space below fixed header
    position: 'relative' as const,
    zIndex: 1,
  },
}

/**
 * Grid layouts
 */
export function getGridStyles(
  columns: number | { mobile: number; tablet: number; desktop: number },
  gap: keyof typeof spacing = 'md'
) {
  const columnValue = typeof columns === 'number'
    ? columns
    : `repeat(${columns.mobile}, 1fr)`

  const tabletColumns = typeof columns === 'object' ? columns.tablet : columns
  const desktopColumns = typeof columns === 'object' ? columns.desktop : columns

  return {
    display: 'grid',
    gridTemplateColumns: columnValue,
    gap: spacing[gap],
    '@media (min-width: 768px)': {
      gridTemplateColumns: `repeat(${tabletColumns}, 1fr)`,
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: `repeat(${desktopColumns}, 1fr)`,
    },
  }
}

/**
 * Flexbox utilities
 */
export const flex = {
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  between: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  column: {
    display: 'flex',
    flexDirection: 'column' as const,
  },

  wrap: {
    display: 'flex',
    flexWrap: 'wrap' as const,
  },
}

/**
 * Position utilities
 */
export const position = {
  fixed: {
    position: 'fixed' as const,
  },

  absolute: {
    position: 'absolute' as const,
  },

  relative: {
    position: 'relative' as const,
  },

  sticky: {
    position: 'sticky' as const,
    top: 0,
  },
}

/**
 * Z-index scale
 */
export const zIndex = {
  base: 1,
  dropdown: 10,
  sticky: 50,
  fixed: 100,
  modal: 200,
  popover: 300,
  tooltip: 400,
  toast: 500,
}
