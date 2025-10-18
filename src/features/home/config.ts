/**
 * Home page configuration
 */
import { homeContent } from '@/content/pages/home'
import { appConfig } from '@/config/app'

export const homeConfig = {
  // Page metadata
  title: homeContent.title,
  description: appConfig.description,

  // Background settings
  background: {
    image: '/images/backgrounds/home-background.jpg',
    position: 'center',
    size: 'auto 150%', // Responsive sizing
    opacity: 0.15,
    filter: 'blur(0.5px)', // Subtle background blur
  },

  // Layout settings
  layout: {
    minHeight: '100vh',
    padding: {
      top: '100px', // Account for nav
      bottom: '60px',
    },
  },

  // Animation timings
  animations: {
    titleDelay: appConfig.animations.titleFadeDelay,
    philosophicalTextDelay: 1000,
    backgroundFade: appConfig.animations.backgroundFadeDuration,
  },

  // Mobile-specific settings
  mobile: {
    preventScroll: true, // Completely non-scrollable on mobile
    layout: {
      padding: {
        top: '80px',
        bottom: '40px',
      },
    },
  },

  // Content settings
  content: {
    showPhilosophicalText: true,
    typingEffect: true,
    cursorBlink: true,
  },
} as const
