/**
 * @fileoverview Tests for GlowText component
 * @description Unit tests for the GlowText component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GlowText } from './GlowText'

describe('GlowText', () => {
  it('should render text content', () => {
    render(<GlowText>Glowing Text</GlowText>)

    expect(screen.getByText('Glowing Text')).toBeInTheDocument()
  })

  it('should apply glow effect styling', () => {
    render(<GlowText>Test</GlowText>)

    const text = screen.getByText('Test')
    expect(text).toHaveStyle({
      textShadow: expect.stringContaining('rgba(255, 255, 255')
    })
  })

  it('should support custom className', () => {
    render(<GlowText className="custom-glow">Test</GlowText>)

    const text = screen.getByText('Test')
    expect(text).toHaveClass('custom-glow')
  })

  it('should support different text content types', () => {
    render(<GlowText>{'Dynamic'} {'Content'}</GlowText>)

    expect(screen.getByText('Dynamic Content')).toBeInTheDocument()
  })
})
