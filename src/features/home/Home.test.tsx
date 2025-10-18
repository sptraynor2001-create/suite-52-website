/**
 * @fileoverview Tests for Home page component
 * @description Integration tests for the home page
 */

import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Home } from './Home'

describe('Home Page', () => {
  const mockOnNavigate = vi.fn()

  beforeEach(() => {
    mockOnNavigate.mockClear()
  })

  it('should render main title', () => {
    render(<Home onNavigate={mockOnNavigate} />)

    expect(screen.getByText('Suite 52')).toBeInTheDocument()
  })

  it('should render navigation links', () => {
    render(<Home onNavigate={mockOnNavigate} />)

    expect(screen.getByText('MUSIC')).toBeInTheDocument()
    expect(screen.getByText('SHOWS')).toBeInTheDocument()
    expect(screen.getByText('ABOUT')).toBeInTheDocument()
    expect(screen.getByText('CONTACT')).toBeInTheDocument()
  })

  it('should call onNavigate when navigation links are clicked', async () => {
    const user = userEvent.setup()
    render(<Home onNavigate={mockOnNavigate} />)

    await user.click(screen.getByText('MUSIC'))
    expect(mockOnNavigate).toHaveBeenCalledWith('music')

    await user.click(screen.getByText('ABOUT'))
    expect(mockOnNavigate).toHaveBeenCalledWith('about')
  })

  it('should render philosophical text with typing animation', async () => {
    render(<Home onNavigate={mockOnNavigate} />)

    // Wait for typing animation to complete
    await waitFor(() => {
      expect(screen.getByText(/const|ARTIST|name|genre|vibe/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should render background image', () => {
    render(<Home onNavigate={mockOnNavigate} />)

    const backgroundDiv = document.querySelector('[style*="background-image"]')
    expect(backgroundDiv).toBeInTheDocument()
    expect(backgroundDiv?.getAttribute('style')).toContain('home-background.jpg')
  })
})
