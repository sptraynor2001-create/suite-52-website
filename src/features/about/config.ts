/**
 * About page configuration
 */
import { aboutContent } from '@/content/pages/about'

export const aboutConfig = {
  // Page metadata
  title: aboutContent.title,

  // Background settings
  background: {
    image: '/images/backgrounds/about-background.jpg',
    position: 'center',
    size: '100% auto',
    opacity: 0.15,
  },

  // Content sections
  sections: {
    bio: {
      enabled: true,
      showImage: false,
    },
    philosophy: {
      enabled: true,
      codeSnippet: aboutContent.codeSnippet,
    },
    social: {
      enabled: false, // Could be added later
    },
  },

  // Animation settings
  animations: {
    titleDelay: 300,
    typingDelay: 1500,
  },
} as const
