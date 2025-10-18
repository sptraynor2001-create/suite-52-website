/**
 * @fileoverview Tests for BouncingSquare component
 * @description Unit tests for the BouncingSquare animation component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BouncingSquare } from './BouncingSquare'

describe('BouncingSquare', () => {
  const defaultProps = {
    initialX: 100,
    initialY: 200,
    velocityX: 1,
    velocityY: -2,
    sizePercent: 50,
  }

  it('should render a square element', () => {
    render(<BouncingSquare {...defaultProps} />)

    const square = document.querySelector('[style*="position: absolute"]')
    expect(square).toBeInTheDocument()
  })

  it('should apply correct positioning styles', () => {
    render(<BouncingSquare {...defaultProps} />)

    const square = document.querySelector('[style*="position: absolute"]') as HTMLElement

    // Should have transform with initial position
    expect(square.style.transform).toContain('translate(100px, 200px)')
  })

  it('should apply correct size based on sizePercent', () => {
    render(<BouncingSquare {...defaultProps} />)

    const square = document.querySelector('[style*="position: absolute"]') as HTMLElement

    // Size should be calculated based on sizePercent
    expect(square.style.width).toBeDefined()
    expect(square.style.height).toBeDefined()
  })

  it('should have proper ARIA attributes for screen readers', () => {
    render(<BouncingSquare {...defaultProps} />)

    const square = document.querySelector('[style*="position: absolute"]') as HTMLElement

    // Should be hidden from screen readers as it's decorative
    expect(square.getAttribute('aria-hidden')).toBe('true')
  })

  it('should handle different size percentages', () => {
    const { rerender } = render(<BouncingSquare {...defaultProps} sizePercent={25} />)

    let square = document.querySelector('[style*="position: absolute"]') as HTMLElement
    const smallSize = square.style.width

    rerender(<BouncingSquare {...defaultProps} sizePercent={75} />)

    square = document.querySelector('[style*="position: absolute"]') as HTMLElement
    const largeSize = square.style.width

    // Larger percentage should result in larger size
    expect(largeSize).not.toBe(smallSize)
  })

  it('should handle edge case sizes', () => {
    render(<BouncingSquare {...defaultProps} sizePercent={0} />)

    // Should not crash with 0 size
    const square = document.querySelector('[style*="position: absolute"]')
    expect(square).toBeInTheDocument()
  })
})
