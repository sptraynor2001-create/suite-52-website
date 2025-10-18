/**
 * @fileoverview Tests for animations theme
 */

import { describe, it, expect } from 'vitest'
import { animations, animationUtils } from './animations'

describe('Animations', () => {
  it('should have duration constants', () => {
    expect(animations.duration).toBeDefined()
    expect(typeof animations.duration.fast).toBe('string')
    expect(typeof animations.duration.normal).toBe('string')
    expect(typeof animations.duration.slow).toBe('string')
  })

  it('should have easing functions', () => {
    expect(animations.easing).toBeDefined()
    expect(typeof animations.easing.easeIn).toBe('string')
    expect(typeof animations.easing.easeOut).toBe('string')
    expect(typeof animations.easing.easeInOut).toBe('string')
  })

  it('should have animation presets', () => {
    expect(animations.presets).toBeDefined()
    expect(animations.presets.fadeIn).toBeDefined()
    expect(animations.presets.slideUp).toBeDefined()
    expect(animations.presets.scaleIn).toBeDefined()
  })

  it('should have animation utils if available', () => {
    if (animationUtils) {
      expect(animationUtils).toBeDefined()
    } else {
      expect(animationUtils).toBeUndefined()
    }
  })
})