/**
 * @fileoverview Tests for home page configuration
 */

import { describe, it, expect } from 'vitest'
import { homeConfig } from './config'

describe('Home Config', () => {
  it('should have valid home page config', () => {
    expect(homeConfig.title).toBeDefined()
    expect(homeConfig.description).toBeDefined()
    expect(homeConfig.background).toBeDefined()
    expect(homeConfig.layout).toBeDefined()
  })

  it('should have background settings', () => {
    expect(homeConfig.background.image).toBeDefined()
    expect(homeConfig.background.position).toBeDefined()
    expect(homeConfig.background.size).toBeDefined()
    expect(typeof homeConfig.background.opacity).toBe('number')
  })

  it('should have animation settings', () => {
    expect(homeConfig.animations).toBeDefined()
    expect(typeof homeConfig.animations.titleDelay).toBe('number')
    expect(typeof homeConfig.animations.philosophicalTextDelay).toBe('number')
    expect(typeof homeConfig.animations.backgroundFade).toBe('number')
  })

  it('should have mobile settings', () => {
    expect(homeConfig.mobile).toBeDefined()
    expect(typeof homeConfig.mobile.preventScroll).toBe('boolean')
    expect(homeConfig.mobile.layout).toBeDefined()
  })

  it('should have content settings', () => {
    expect(homeConfig.content).toBeDefined()
    expect(typeof homeConfig.content.showPhilosophicalText).toBe('boolean')
    expect(typeof homeConfig.content.typingEffect).toBe('boolean')
  })
})