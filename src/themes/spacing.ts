/**
 * Spacing system - Consistent spacing values
 */

// Base spacing scale (in pixels)
export const spacingScale = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
} as const

export const spacing = {
  // Base spacing scale (in pixels)
  scale: spacingScale,

  // Semantic spacing (component-specific)
  component: {
    // Layout spacing
    page: {
      padding: {
        mobile: spacingScale[4],
        tablet: spacingScale[6],
        desktop: spacingScale[8],
      },
      margin: {
        top: spacingScale[20], // Account for fixed nav
        bottom: spacingScale[12],
      },
    },

    // Card spacing
    card: {
      padding: spacingScale[6],
      gap: spacingScale[4],
      margin: {
        bottom: spacingScale[6],
      },
    },

    // Button spacing
    button: {
      padding: `${spacingScale[2]} ${spacingScale[4]}`,
      gap: spacingScale[2],
    },

    // Form spacing
    form: {
      fieldGap: spacingScale[4],
      sectionGap: spacingScale[6],
      labelMargin: spacingScale[2],
    },

    // Navigation spacing
    nav: {
      itemGap: spacingScale[8],
      padding: `${spacingScale[4]} ${spacingScale[6]}`,
    },
  },

  // Content spacing
  content: {
    sectionGap: spacingScale[12],
    paragraphGap: spacingScale[4],
    listItemGap: spacingScale[2],
  },

  // Responsive spacing adjustments
  responsive: {
    mobile: {
      pagePadding: spacingScale[4],
      componentGap: spacingScale[3],
    },
    tablet: {
      pagePadding: spacingScale[6],
      componentGap: spacingScale[4],
    },
    desktop: {
      pagePadding: spacingScale[8],
      componentGap: spacingScale[6],
    },
  },
} as const

// Utility functions for spacing calculations
export const spacingUtils = {
  // Calculate responsive spacing
  responsive: (mobile: string, tablet?: string, desktop?: string) => ({
    mobile,
    tablet: tablet || mobile,
    desktop: desktop || tablet || mobile,
  }),

  // Calculate proportional spacing
  proportional: (base: number, ratio: number) => `${base * ratio}px`,

  // Get spacing for specific breakpoint
  getBreakpointSpacing: (breakpoint: 'mobile' | 'tablet' | 'desktop') =>
    spacing.responsive[breakpoint],
} as const
