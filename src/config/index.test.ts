/**
 * @fileoverview Tests for config index utilities
 */

import { describe, it, expect } from 'vitest'
import { configUtils, appConfig, routes, navigation } from './index'

describe('Config Utilities', () => {
  it('should check if features are enabled', () => {
    expect(configUtils.isFeatureEnabled('music')).toBe(appConfig.features.music)
    expect(configUtils.isFeatureEnabled('liveSets')).toBe(appConfig.features.liveSets)
  })

  it('should get routes by key', () => {
    expect(configUtils.getRoute('home')).toBe(routes.home)
    expect(configUtils.getRoute('about')).toBe(routes.about)
  })

  it('should get navigation items', () => {
    const navItems = configUtils.getNavigationItems()
    expect(Array.isArray(navItems)).toBe(true)
    expect(navItems.length).toBeGreaterThan(0)
  })

  it('should get app metadata', () => {
    const meta = configUtils.getAppMeta()
    expect(meta.name).toBe('Suite 52')
    expect(meta.description).toBeDefined()
    expect(meta.url).toBeDefined()
    expect(meta.ogImage).toBeDefined()
  })

  it('should export all required configs', () => {
    expect(appConfig).toBeDefined()
    expect(routes).toBeDefined()
    expect(navigation).toBeDefined()
  })
})