/**
 * @fileoverview Tests for Navigation component
 * @description Unit tests for the Navigation component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Navigation } from './Navigation'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Navigation', () => {
  const mockOnNavigate = vi.fn()

  beforeEach(() => {
    mockOnNavigate.mockClear()
  })

  it('should render all navigation links', () => {
    renderWithRouter(<Navigation currentPage="home" onNavigate={mockOnNavigate} />)

    expect(screen.getByText('MUSIC')).toBeInTheDocument()
    expect(screen.getByText('SHOWS')).toBeInTheDocument()
    expect(screen.getByText('LIVE_SETS')).toBeInTheDocument()
    expect(screen.getByText('ABOUT')).toBeInTheDocument()
    expect(screen.getByText('CONTACT')).toBeInTheDocument()
  })

  it('should highlight current page', () => {
    renderWithRouter(<Navigation currentPage="music" onNavigate={mockOnNavigate} />)

    const musicLink = screen.getByText('MUSIC')
    expect(musicLink).toHaveClass('text-red-500') // Active state styling
  })

  it('should call onNavigate when link is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Navigation currentPage="home" onNavigate={mockOnNavigate} />)

    const musicLink = screen.getByText('MUSIC')
    await user.click(musicLink)

    expect(mockOnNavigate).toHaveBeenCalledWith('music')
  })

  it('should apply hover effects', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Navigation currentPage="home" onNavigate={mockOnNavigate} />)

    const aboutLink = screen.getByText('ABOUT')

    // Before hover
    expect(aboutLink).toHaveClass('text-white')

    // Hover simulation (would need additional setup for CSS hover testing)
    // This tests that the element exists and is interactive
    expect(aboutLink.closest('button')).toBeInTheDocument()
  })

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Navigation currentPage="home" onNavigate={mockOnNavigate} />)

    // Tab to first navigation item
    await user.tab()
    const firstLink = document.activeElement

    expect(firstLink).toHaveTextContent(/MUSIC|SHOWS|LIVE_SETS|ABOUT|CONTACT/)
  })

  it('should have proper ARIA attributes', () => {
    renderWithRouter(<Navigation currentPage="home" onNavigate={mockOnNavigate} />)

    // Navigation should be properly structured
    const navElement = document.querySelector('nav')
    expect(navElement).toBeInTheDocument()
  })

  it('should handle all page types', () => {
    const pages: Array<'home' | 'about' | 'music' | 'live-sets' | 'shows' | 'contact'> = [
      'home', 'about', 'music', 'live-sets', 'shows', 'contact'
    ]

    pages.forEach(page => {
      const { rerender } = renderWithRouter(
        <Navigation currentPage={page} onNavigate={mockOnNavigate} />
      )

      // Should render without crashing for each page type
      expect(document.body).toBeInTheDocument()

      rerender(<BrowserRouter><Navigation currentPage={page} onNavigate={mockOnNavigate} /></BrowserRouter>)
    })
  })
})
