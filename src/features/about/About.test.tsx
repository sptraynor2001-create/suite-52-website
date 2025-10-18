/**
 * @fileoverview Tests for About page component
 * @description Integration tests for the About page
 */

import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { About } from './About'

describe('About Page', () => {
  it('should render page title', () => {
    render(<About />)

    expect(screen.getByText('ABOUT')).toBeInTheDocument()
  })

  it('should render page content sections', () => {
    render(<About />)

    // Should contain main content sections
    expect(screen.getByText(/Suite 52/i)).toBeInTheDocument()
  })

  it('should render background image', () => {
    render(<About />)

    const backgroundDiv = document.querySelector('[style*="background-image"]')
    expect(backgroundDiv).toBeInTheDocument()
    expect(backgroundDiv?.getAttribute('style')).toContain('about-background.jpg')
  })

  it('should trigger typing animation', async () => {
    render(<About />)

    // Wait for typing animation to start
    await waitFor(() => {
      const subtitle = screen.getByText(/ARTIST|const|name|genre|vibe/i)
      expect(subtitle).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('should have proper heading hierarchy', () => {
    render(<About />)

    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)

    // Should have the main title
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('ABOUT')
  })

  it('should be responsive', () => {
    render(<About />)

    // Container should be responsive
    const container = screen.getByText('ABOUT').closest('div')
    expect(container).toHaveStyle({ maxWidth: '900px' })
  })

  it('should handle content rendering', () => {
    render(<About />)

    // Should render without crashing
    expect(document.body).toBeInTheDocument()
  })
})
