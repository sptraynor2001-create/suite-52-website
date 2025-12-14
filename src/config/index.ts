/**
 * Configuration system index - Unified config exports
 */

import { appConfig } from './app'
import { routes, navigation } from './routing'
import { particleConfig } from './particles'

export { appConfig, routes, navigation, particleConfig }

// Configuration utilities
export const configUtils = {
  // Check if feature is enabled
  isFeatureEnabled: (feature: keyof typeof appConfig.features) =>
    appConfig.features[feature],

  // Get route by key
  getRoute: (routeKey: keyof typeof routes) =>
    routes[routeKey],

  // Get navigation items
  getNavigationItems: () => navigation.primary,

  // Get app metadata
  getAppMeta: () => ({
    name: appConfig.name,
    description: appConfig.description,
    url: appConfig.url,
    ogImage: appConfig.ogImage,
  }),
} as const
