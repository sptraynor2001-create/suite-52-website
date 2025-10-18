/**
 * Application-wide configuration
 */
export const appConfig = {
  name: 'Suite 52',
  description: 'Producer • DJ • Artist - Technical Electronic Music',
  url: 'https://suite52.art',
  ogImage: '/images/backgrounds/dj-photo.jpg',

  // Feature flags
  features: {
    liveSets: true,
    shows: true,
    music: true,
    contact: true,
    epk: false, // Hidden from navigation
  },

  // Animation settings
  animations: {
    titleFadeDelay: 300,
    typingStartDelay: 1500,
    backgroundFadeDuration: 1500,
  },

  // Performance settings
  performance: {
    lazyLoadThreshold: 100,
    imageLoading: 'eager', // or 'lazy'
  },

  // Social links
  social: {
    instagram: {
      handle: '@suite52sounds',
      url: 'https://instagram.com/suite52sounds',
    },
    email: 'suite52sounds@gmail.com',
  },
} as const
