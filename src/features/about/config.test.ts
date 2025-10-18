/**
 * @fileoverview Tests for about page configuration
 */

import { describe, it, expect } from 'vitest'
import { aboutConfig } from './config'

describe('About Config', () => {
  it('should have valid about page config', () => {
    expect(aboutConfig).toBeDefined()
    expect(aboutConfig.animations).toBeDefined()
  })

  it('should have animation settings', () => {
    expect(typeof aboutConfig.animations.typingDelay).toBe('number')
  })

  it('should have reasonable animation timings', () => {
    expect(aboutConfig.animations.typingDelay).toBeGreaterThan(0)
    expect(aboutConfig.animations.typingDelay).toBeLessThan(5000)
  })
})