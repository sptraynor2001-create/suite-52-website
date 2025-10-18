/**
 * Content system index - Unified content exports
 */

// Page content
export { homeContent } from './pages/home'
export { aboutContent } from './pages/about'
export { musicContent } from './pages/music'
export { showsContent } from './pages/shows'
export { contactContent } from './pages/contact'
export { liveSetsContent } from './pages/liveSets'

// Component content
export { componentContent } from './components'

// Shared content
export { sharedContent } from './shared'

// Content utilities
export const contentUtils = {
  // Get content by page
  getPageContent: (page: string) => {
    const contentMap = {
      home: homeContent,
      about: aboutContent,
      music: musicContent,
      shows: showsContent,
      contact: contactContent,
      'live-sets': liveSetsContent,
    }
    return contentMap[page as keyof typeof contentMap]
  },

  // Get component content
  getComponentContent: (component: string) => {
    return componentContent[component as keyof typeof componentContent]
  },
} as const
