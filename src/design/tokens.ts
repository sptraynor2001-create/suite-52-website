/**
 * Design System - Design Tokens
 * Spacing, typography, shadows, and other design values
 */

export const tokens = {
  // Spacing scale (in rem)
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    32: '8rem',       // 128px
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      display: ['Orbitron', 'Inter', 'sans-serif'], // Futuristic display font
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
      base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
      '5xl': ['3rem', { lineHeight: '1' }],          // 48px
      '6xl': ['3.75rem', { lineHeight: '1' }],       // 60px
      '7xl': ['4.5rem', { lineHeight: '1' }],        // 72px
      '8xl': ['6rem', { lineHeight: '1' }],          // 96px
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Shadows - Grayscale depth
  shadows: {
    // Subtle depth
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.7)',

    // Subtle highlights (grayscale glows)
    glow: {
      blue: {
        sm: '0 0 10px rgba(255, 255, 255, 0.1)',
        md: '0 0 20px rgba(255, 255, 255, 0.15)',
        lg: '0 0 30px rgba(255, 255, 255, 0.2)',
      },
      cyan: {
        sm: '0 0 10px rgba(255, 255, 255, 0.1)',
        md: '0 0 20px rgba(255, 255, 255, 0.15)',
        lg: '0 0 30px rgba(255, 255, 255, 0.2)',
      },
      purple: {
        sm: '0 0 10px rgba(255, 255, 255, 0.1)',
        md: '0 0 20px rgba(255, 255, 255, 0.15)',
        lg: '0 0 30px rgba(255, 255, 255, 0.2)',
      },
    },

    // Inner shadows
    inner: {
      blue: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
      cyan: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
    },
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Border widths
  borderWidth: {
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },

  // Opacity levels
  opacity: {
    0: '0',
    5: '0.05',
    10: '0.1',
    20: '0.2',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    80: '0.8',
    90: '0.9',
    100: '1',
  },

  // Z-index layers
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Blur effects
  blur: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
    '3xl': '64px',
  },

  // Backdrop blur
  backdropBlur: {
    none: '0',
    sm: 'blur(4px)',
    base: 'blur(8px)',
    md: 'blur(12px)',
    lg: 'blur(16px)',
    xl: 'blur(24px)',
  },
} as const

export type DesignTokens = typeof tokens

