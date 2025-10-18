/**
 * @fileoverview Tests for color definitions
 */

import { describe, it, expect } from 'vitest'
import { colors } from './colors'

describe('Colors', () => {
  it('should export gray colors', () => {
    expect(colors.gray).toBeDefined()
    expect(colors.gray[50]).toBeDefined()
    expect(colors.gray[900]).toBeDefined()
  })

  it('should export black colors', () => {
    expect(colors.black).toBeDefined()
    expect(colors.black[50]).toBe('#000000')
  })

  it('should export text colors', () => {
    expect(colors.text).toBeDefined()
    expect(colors.text.primary).toBe('#ffffff')
  })

  it('should export accent colors', () => {
    expect(colors.accent).toBeDefined()
    expect(colors.accent.light).toBeDefined()
  })
})
