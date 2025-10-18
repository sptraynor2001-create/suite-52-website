/**
 * @fileoverview Tests for home page content
 */

import { describe, it, expect } from 'vitest'
import { homeContent } from './home'

describe('Home Content', () => {
  it('should have valid home content structure', () => {
    expect(homeContent.title).toBe('Suite 52')
    expect(homeContent.subtitle).toBeDefined()
    expect(homeContent.philosophicalText).toBeDefined()
  })

  it('should have navigation content', () => {
    expect(homeContent.navigation).toBeDefined()
    expect(homeContent.navigation.music).toBe('MUSIC')
    expect(homeContent.navigation.shows).toBe('SHOWS')
    expect(homeContent.navigation.liveSets).toBe('LIVE_SETS')
    expect(homeContent.navigation.about).toBe('ABOUT')
    expect(homeContent.navigation.contact).toBe('CONTACT')
  })

  it('should have hero content', () => {
    expect(homeContent.hero).toBeDefined()
    expect(typeof homeContent.hero.greeting).toBe('string')
    expect(typeof homeContent.hero.tagline).toBe('string')
  })
})