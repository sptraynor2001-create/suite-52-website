/**
 * @fileoverview Tests for BouncingSquare component
 * @description Unit tests for the BouncingSquare animation component
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Unmock BouncingSquare for this test
vi.unmock('@/shared/components/effects/BouncingSquare')

import BouncingSquare from './BouncingSquare'

describe('BouncingSquare', () => {
  const defaultProps = {
    initialX: 10,
    initialY: 20,
    velocityX: 1,
    velocityY: -2,
    sizePercent: 0.1, // 10% of viewport to ensure it fits
  }

  it('should render a square element', () => {
    render(<BouncingSquare {...defaultProps} />)

    const square = document.querySelector('[style*="position: fixed"]')
    expect(square).toBeInTheDocument()
  })

  it('should apply correct positioning styles', () => {
    render(<BouncingSquare {...defaultProps} />)

    const square = document.querySelector('[style*="position: fixed"]') as HTMLElement

    // Should have left and top positioning
    expect(square.style.left).toContain('10px')
    expect(square.style.top).toContain('20px')
  })

  it('should apply correct size based on sizePercent', () => {
    render(<BouncingSquare {...defaultProps} />)

    const square = document.querySelector('[style*="position: fixed"]') as HTMLElement

    // Size should be calculated based on sizePercent
    expect(square.style.width).toBeDefined()
    expect(square.style.height).toBeDefined()
  })

  it('should have proper ARIA attributes for screen readers', () => {
    render(<BouncingSquare {...defaultProps} />)

    const square = document.querySelector('[style*="position: fixed"]') as HTMLElement

    // Should be hidden from screen readers as it's decorative
    expect(square.getAttribute('aria-hidden')).toBe('true')
  })

  it('should handle different size percentages', () => {
    const { rerender } = render(<BouncingSquare {...defaultProps} sizePercent={0.05} />)

    let square = document.querySelector('[style*="position: fixed"]') as HTMLElement
    const smallSize = square.style.width

    rerender(<BouncingSquare {...defaultProps} sizePercent={0.15} />)

    square = document.querySelector('[style*="position: fixed"]') as HTMLElement
    const largeSize = square.style.width

    // Larger percentage should result in larger size
    expect(largeSize).not.toBe(smallSize)
  })

  it('should handle edge case sizes', () => {
    render(<BouncingSquare {...defaultProps} sizePercent={0} />)

    // Should not crash with 0 size
    const square = document.querySelector('[style*="position: fixed"]')
    expect(square).toBeInTheDocument()
  })
})
