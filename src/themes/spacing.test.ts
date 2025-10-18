/**
 * @fileoverview Tests for spacing theme
 */

import { describe, it, expect } from 'vitest'
import { spacing, spacingScale, spacingUtils } from './spacing'

describe('Spacing System', () => {
  it('should have spacing scale', () => {
    expect(spacingScale).toBeDefined()
    expect(spacingScale[0]).toBe('0px')
    expect(spacingScale[1]).toBe('4px')
    expect(spacingScale[4]).toBe('16px')
    expect(spacingScale[8]).toBe('32px')
  })

  it('should have component spacing', () => {
    expect(spacing.component).toBeDefined()
    expect(spacing.component.page).toBeDefined()
    expect(spacing.component.card).toBeDefined()
    expect(spacing.component.button).toBeDefined()
  })

  it('should have content spacing', () => {
    expect(spacing.content).toBeDefined()
    expect(spacing.content.sectionGap).toBeDefined()
    expect(spacing.content.paragraphGap).toBeDefined()
  })

  it('should have responsive spacing', () => {
    expect(spacing.responsive).toBeDefined()
    expect(spacing.responsive.mobile).toBeDefined()
    expect(spacing.responsive.tablet).toBeDefined()
    expect(spacing.responsive.desktop).toBeDefined()
  })

  it('should have spacing utilities', () => {
    expect(spacingUtils.responsive).toBeDefined()
    expect(spacingUtils.proportional).toBeDefined()
    expect(spacingUtils.getBreakpointSpacing).toBeDefined()
  })

  it('should create responsive spacing', () => {
    const responsive = spacingUtils.responsive('16px', '24px', '32px')
    expect(responsive.mobile).toBe('16px')
    expect(responsive.tablet).toBe('24px')
    expect(responsive.desktop).toBe('32px')
  })

  it('should calculate proportional spacing', () => {
    const proportional = spacingUtils.proportional(16, 1.5)
    expect(proportional).toBe('24px')
  })

  it('should get breakpoint spacing', () => {
    const mobileSpacing = spacingUtils.getBreakpointSpacing('mobile')
    expect(mobileSpacing).toBeDefined()
    expect(typeof mobileSpacing.pagePadding).toBe('string')
  })
})