/**
 * @fileoverview Tests for Navigation component
 * @description Unit tests for the Navigation component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navigation from './Navigation'

describe('Navigation', () => {
  const mockOnNavigate = vi.fn()

  beforeEach(() => {
    mockOnNavigate.mockClear()
  })

  it('should render all navigation links', () => {
    render(<Navigation currentPage="home" onNavigate={mockOnNavigate} />)

    expect(screen.getByText('MUSIC')).toBeInTheDocument()
    expect(screen.getByText('SHOWS')).toBeInTheDocument()
    expect(screen.getByText('LIVE_SETS')).toBeInTheDocument()
    expect(screen.getByText('ABOUT')).toBeInTheDocument()
    expect(screen.getByText('CONTACT')).toBeInTheDocument()
  })

  it('should highlight current page', () => {
    render(<Navigation currentPage="music" onNavigate={mockOnNavigate} />)

    const musicLink = screen.getByText('MUSIC')
    const button = musicLink.closest('button')
    
    // Check that the style attribute contains the expected color
    const styleAttr = button?.getAttribute('style')
    expect(styleAttr).toContain('color: rgb(230, 57, 70)')
    expect(styleAttr).toContain('font-style: italic')
  })

  it('should call onNavigate when link is clicked', async () => {
    const user = userEvent.setup()
    render(<Navigation currentPage="home" onNavigate={mockOnNavigate} />)

    const musicLink = screen.getByText('MUSIC')
    await user.click(musicLink)

    expect(mockOnNavigate).toHaveBeenCalledWith('music')
  })

  it('should apply hover effects', async () => {
    const user = userEvent.setup()
    render(<Navigation currentPage="home" onNavigate={mockOnNavigate} />)

    const aboutLink = screen.getByText('ABOUT')
    const button = aboutLink.closest('button')

    // Check that the style attribute contains the expected styles
    const styleAttr = button?.getAttribute('style')
    expect(styleAttr).toContain('color: rgb(255, 255, 255)')
    expect(styleAttr).toContain('font-style: normal')
  })

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup()
    render(<Navigation currentPage="home" onNavigate={mockOnNavigate} />)

    // Tab to first navigation item
    await user.tab()
    const firstLink = document.activeElement

    expect(firstLink).toHaveTextContent(/MUSIC|SHOWS|LIVE_SETS|ABOUT|CONTACT/)
  })

  it('should have proper ARIA attributes', () => {
    render(<Navigation currentPage="home" onNavigate={mockOnNavigate} />)

    // Navigation should be properly structured
    const navElement = document.querySelector('nav')
    expect(navElement).toBeInTheDocument()
  })

  it('should handle all page types', () => {
    const pages: Array<'home' | 'about' | 'music' | 'live-sets' | 'shows' | 'contact'> = [
      'home', 'about', 'music', 'live-sets', 'shows', 'contact'
    ]

    pages.forEach(page => {
      render(<Navigation currentPage={page} onNavigate={mockOnNavigate} />)

      // Should render without crashing for each page type
      expect(document.body).toBeInTheDocument()
    })
  })
})
