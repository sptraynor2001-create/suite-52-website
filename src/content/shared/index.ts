/**
 * Shared content across the application
 */
export const sharedContent = {
  navigation: {
    brand: 'Suite 52',
    skipToMain: 'Skip to main content',
  },
  footer: {
    copyright: '© 2024 Suite 52. All rights reserved.',
    tagline: 'Technical. Digital. Sound.',
  },
  loading: {
    default: 'Loading...',
    page: 'Loading page...',
  },
  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    notFound: 'Page not found.',
  },
  accessibility: {
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    externalLink: 'Opens in new tab',
  },
} as const
