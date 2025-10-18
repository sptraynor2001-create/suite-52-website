/**
 * Application routing configuration
 */
export const routes = {
  home: '/',
  about: '/about',
  music: '/music',
  shows: '/shows',
  contact: '/contact',
  liveSets: '/live-sets',
  epk: '/epk',
} as const

export const navigation = {
  primary: [
    { path: routes.music, label: 'MUSIC' },
    { path: routes.shows, label: 'SHOWS' },
    { path: routes.liveSets, label: 'LIVE_SETS' },
    { path: routes.about, label: 'ABOUT' },
    { path: routes.contact, label: 'CONTACT' },
  ],
  hidden: [
    { path: routes.epk, label: 'ELECTRONIC_PRESS_KIT' },
  ],
} as const

export type RouteKeys = keyof typeof routes
export type RouteValues = typeof routes[RouteKeys]
