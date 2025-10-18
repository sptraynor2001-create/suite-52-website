/**
 * @fileoverview Tests for Card component
 * @description Unit tests for the reusable Card component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('should render children content', () => {
    render(
      <Card>
        <div>Test Content</div>
      </Card>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should apply default shadow styling', () => {
    render(<Card>Test</Card>)

    const card = screen.getByText('Test').parentElement
    expect(card).toHaveClass('shadow-md')
  })

  it('should support custom className', () => {
    render(<Card className="custom-class">Test</Card>)

    const card = screen.getByText('Test').parentElement
    expect(card).toHaveClass('custom-class')
  })

  it('should be accessible as a generic container', () => {
    render(<Card>Test</Card>)

    // Should be a div, not a semantic element that might conflict
    const card = screen.getByText('Test').parentElement
    expect(card?.tagName).toBe('DIV')
  })
})
