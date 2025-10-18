/**
 * Typography system - Granular text styling
 */

import { colors, componentColors } from './colors'

export const fonts = {
  primary: {
    family: 'Ubuntu Mono, monospace',
    weight: {
      normal: 400,
      bold: 700,
    },
    style: {
      normal: 'normal',
      italic: 'italic',
    },
  },

  // Alternative fonts for variety
  alternatives: {
    sans: 'system-ui, -apple-system, sans-serif',
    serif: 'Georgia, serif',
    mono: 'Monaco, Consolas, monospace',
  },
} as const

export const textStyles = {
  // Heading styles
  heading: {
    h1: {
      fontSize: '42px',
      fontWeight: fonts.primary.weight.bold,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: componentColors.text.primary,
      textShadow: `0 0 20px ${componentColors.text.primary}1a`, // 10% opacity
    },

    h2: {
      fontSize: '32px',
      fontWeight: fonts.primary.weight.bold,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: componentColors.text.primary,
    },

    h3: {
      fontSize: '24px',
      fontWeight: fonts.primary.weight.bold,
      lineHeight: 1.4,
      color: componentColors.text.primary,
    },

    h4: {
      fontSize: '20px',
      fontWeight: fonts.primary.weight.normal,
      lineHeight: 1.4,
      color: componentColors.text.primary,
    },
  },

  // Body text styles
  body: {
    large: {
      fontSize: '18px',
      lineHeight: 1.6,
      color: componentColors.text.primary,
    },

    regular: {
      fontSize: '16px',
      lineHeight: 1.6,
      color: componentColors.text.primary,
    },

    small: {
      fontSize: '14px',
      lineHeight: 1.5,
      color: componentColors.text.secondary,
    },

    xs: {
      fontSize: '12px',
      lineHeight: 1.4,
      color: componentColors.text.muted,
    },
  },

  // Special text styles
  special: {
    code: {
      fontFamily: fonts.primary.family,
      fontSize: '14px',
      lineHeight: 1.4,
      color: colors.brand.primary,
      background: colors.neutral.gray[900],
      padding: '2px 6px',
      borderRadius: '4px',
    },

    link: {
      color: colors.brand.primary,
      textDecoration: 'none',
      transition: 'opacity 0.2s ease',

      hover: {
        opacity: 0.8,
      },
    },

    button: {
      fontWeight: fonts.primary.weight.bold,
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },

  // Responsive text scaling
  responsive: {
    mobile: {
      h1: { fontSize: '36px' },
      h2: { fontSize: '28px' },
      h3: { fontSize: '22px' },
      body: { fontSize: '15px' },
    },

    tablet: {
      h1: { fontSize: '40px' },
      h2: { fontSize: '30px' },
      h3: { fontSize: '24px' },
      body: { fontSize: '16px' },
    },
  },
} as const

// Typography scale for consistent sizing
export const fontSizes = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
  '5xl': '48px',
  '6xl': '60px',
} as const

export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const

export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const
