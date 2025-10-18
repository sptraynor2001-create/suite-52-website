/**
 * @fileoverview Tests for gradient definitions
 */

import { describe, it, expect } from 'vitest'
import { gradients } from './gradients'

describe('Gradients', () => {
  it('should export gradient definitions', () => {
    expect(gradients).toBeDefined()
    expect(gradients.midnight).toBeDefined()
    expect(gradients.abyss).toBeDefined()
  })

  it('should have mesh gradient', () => {
    expect(gradients.mesh).toBeDefined()
    expect(gradients.mesh).toContain('radial-gradient')
  })

  it('should have midnight gradients', () => {
    expect(gradients.midnight.vertical).toContain('linear-gradient')
    expect(gradients.midnight.horizontal).toContain('linear-gradient')
  })

  it('should have neon gradients', () => {
    expect(gradients.neon).toBeDefined()
    expect(gradients.neon.cyan).toBeDefined()
  })
})
