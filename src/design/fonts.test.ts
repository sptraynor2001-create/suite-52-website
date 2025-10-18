/**
 * @fileoverview Tests for font definitions
 */

import { describe, it, expect } from 'vitest'
import { fontOptions, activeFont } from './fonts'

describe('Fonts', () => {
  it('should export font options', () => {
    expect(fontOptions.length).toBeGreaterThan(0)
  })

  it('should have default active font', () => {
    expect(activeFont).toBeDefined()
    expect(activeFont.name).toBe('Ubuntu Mono')
    expect(activeFont.family).toBeDefined()
  })

  it('should have required font properties', () => {
    fontOptions.forEach(font => {
      expect(font.name).toBeDefined()
      expect(font.family).toBeDefined()
    })
  })

  it('should have 10 font options', () => {
    expect(fontOptions.length).toBe(10)
  })
})
