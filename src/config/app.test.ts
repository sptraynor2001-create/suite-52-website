/**
 * @fileoverview Tests for app configuration
 */

import { describe, it, expect } from 'vitest'
import { appConfig } from './app'

describe('App Configuration', () => {
  it('should have valid app metadata', () => {
    expect(appConfig.name).toBe('Suite 52')
    expect(appConfig.description).toBe('Producer • DJ • Artist - Technical Electronic Music')
    expect(appConfig.url).toBe('https://suite52.art')
    expect(appConfig.ogImage).toBe('/images/backgrounds/dj-photo.jpg')
  })

  it('should have feature flags', () => {
    expect(appConfig.features).toBeDefined()
    expect(typeof appConfig.features.liveSets).toBe('boolean')
    expect(typeof appConfig.features.shows).toBe('boolean')
    expect(typeof appConfig.features.music).toBe('boolean')
    expect(typeof appConfig.features.contact).toBe('boolean')
    expect(typeof appConfig.features.epk).toBe('boolean')
  })

  it('should have animation settings', () => {
    expect(appConfig.animations).toBeDefined()
    expect(typeof appConfig.animations.titleFadeDelay).toBe('number')
    expect(typeof appConfig.animations.typingStartDelay).toBe('number')
    expect(typeof appConfig.animations.backgroundFadeDuration).toBe('number')
  })

  it('should have performance settings', () => {
    expect(appConfig.performance).toBeDefined()
    expect(typeof appConfig.performance.lazyLoadThreshold).toBe('number')
    expect(appConfig.performance.imageLoading).toMatch(/^(eager|lazy)$/)
  })

  it('should have social links', () => {
    expect(appConfig.social.instagram.handle).toBe('@suite52sounds')
    expect(appConfig.social.instagram.url).toBe('https://instagram.com/suite52sounds')
    expect(appConfig.social.email).toBe('suite52sounds@gmail.com')
  })
})