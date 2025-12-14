/**
 * Background Configuration
 * Centralized background image opacity and positioning values
 */

export const backgrounds = {
  home: {
    opacity: {
      main: 0.25,
      trailLeft: 0.05,
      trailRight: 0.05,
      secondary: 0.10,
    },
    blur: {
      main: '1.5px',
      trail: '15px',
      secondary: '5px',
    },
    saturation: {
      main: 0.7,
      trail: 0.6,
      secondary: 0.5,
    },
    position: 'center 25%',
  },
  about: {
    opacity: 0.15,
    blur: '1px',
    saturation: 0.7,
    position: 'center',
  },
  music: {
    opacity: 0.15,
    blur: '1px',
    saturation: 0.7,
    position: 'center',
  },
  shows: {
    opacity: 0.15,
    blur: '1px',
    saturation: 0.7,
    position: 'center',
  },
  liveSets: {
    opacity: 0.08,
    blur: '1px',
    saturation: 0.7,
    position: 'center',
  },
  contact: {
    opacity: 0.15,
    blur: '1px',
    saturation: 0, // Grayscale
    position: {
      desktop: 'center top',
      mobile: 'center',
    },
  },
} as const

