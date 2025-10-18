/**
 * @fileoverview Tests for shared content
 */

import { describe, it, expect } from 'vitest'
import { sharedContent } from './index'

describe('Shared Content', () => {
  it('should have shared content defined', () => {
    expect(sharedContent).toBeDefined()
  })

  it('should be an object', () => {
    expect(typeof sharedContent).toBe('object')
  })

  it('should have navigation content if available', () => {
    if (sharedContent.navigation) {
      expect(sharedContent.navigation).toBeDefined()
    }
  })

  it('should have error messages if available', () => {
    if (sharedContent.errors) {
      expect(sharedContent.errors).toBeDefined()
    }
  })

  it('should have loading messages if available', () => {
    if (sharedContent.loading) {
      expect(sharedContent.loading).toBeDefined()
    }
  })
})