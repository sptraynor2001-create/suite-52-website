/**
 * Application constants
 */

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.5,
  slow: 1.0,
} as const

// Z-index layers
export const Z_INDEX = {
  background: -1,
  content: 1,
  navigation: 10,
  modal: 100,
  tooltip: 1000,
} as const

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

// API endpoints (example)
export const API_ENDPOINTS = {
  shows: '/api/shows',
  music: '/api/music',
  contact: '/api/contact',
} as const

// Route paths
export const ROUTES = {
  home: '/',
  about: '/about',
  music: '/music',
  shows: '/shows',
  contact: '/contact',
  'live-sets': '/live-sets',
} as const
