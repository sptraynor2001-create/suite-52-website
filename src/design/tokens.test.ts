/**
 * @fileoverview Tests for design tokens
 */

import { describe, it, expect } from 'vitest'
import * as tokens from './tokens'

describe('Design Tokens', () => {
  it('should export design tokens', () => {
    expect(Object.keys(tokens).length).toBeGreaterThan(0)
  })
})
