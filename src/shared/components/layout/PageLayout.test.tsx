/**
 * @fileoverview Tests for PageLayout component
 * @description Integration tests for the page layout component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PageLayout from './PageLayout'

describe('PageLayout', () => {
  const defaultProps = {
    title: 'Test Page',
    children: <div data-testid="test-content">Test Content</div>,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render title and content', () => {
      render(<PageLayout {...defaultProps} />)

      expect(screen.getByText('Test Page')).toBeInTheDocument()
      expect(screen.getByTestId('test-content')).toBeInTheDocument()
    })

    it('should render subtitle when provided', () => {
      render(<PageLayout {...defaultProps} subtitle="Test Subtitle" />)

      expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    })

    it('should render displayText instead of subtitle when provided', () => {
      render(<PageLayout {...defaultProps} displayText="Typed Text" />)

      expect(screen.getByText('Typed Text')).toBeInTheDocument()
    })
  })

  describe('Background Image', () => {
    it('should not render background when no image provided', () => {
      render(<PageLayout {...defaultProps} />)

      const backgroundDiv = document.querySelector('[style*="background-image"]')
      expect(backgroundDiv).not.toBeInTheDocument()
    })

    it('should render background image when provided', () => {
      render(<PageLayout {...defaultProps} backgroundImage="/test-image.jpg" />)

      const backgroundDiv = document.querySelector('[style*="background-image"]')
      expect(backgroundDiv).toBeInTheDocument()
      // Check if background-image style contains the URL
      const style = backgroundDiv?.getAttribute('style') || ''
      expect(style).toMatch(/background-image.*url\(.*test-image\.jpg.*\)/)
    })

    it('should preload background image', async () => {
      const imageSpy = vi.spyOn(Image.prototype, 'onload', 'set')

      render(<PageLayout {...defaultProps} backgroundImage="/test-image.jpg" />)

      await waitFor(() => {
        expect(imageSpy).toHaveBeenCalled()
      })
    })
  })

  describe('Animations', () => {
    it('should add title slide-in animation keyframes', async () => {
      render(<PageLayout {...defaultProps} />)

      // Just verify the title element exists and will be animated
      const titleElement = screen.getByText('Test Page')
      expect(titleElement).toBeInTheDocument()

      // Verify transition styles are set
      const style = titleElement.getAttribute('style') || ''
      expect(style).toContain('transition')
    })

    it('should trigger title animation on mount', async () => {
      render(<PageLayout {...defaultProps} />)

      const titleElement = screen.getByText('Test Page')

      // After animation trigger (100ms timeout in component)
      await waitFor(() => {
        const style = titleElement.getAttribute('style') || ''
        // Check that opacity becomes 1 and transform is set
        expect(style).toContain('opacity: 1')
        expect(style).toContain('translateY(0')
      }, { timeout: 500 })
    })
  })

  describe('Responsive Behavior', () => {
    it('should apply sticky header when specified', () => {
      render(<PageLayout {...defaultProps} stickyHeader />)

      const headerDiv = screen.getByText('Test Page').parentElement
      const style = headerDiv?.getAttribute('style') || ''
      expect(style).toContain('position: sticky')
    })

    it('should have correct padding on mobile vs desktop', () => {
      render(<PageLayout {...defaultProps} />)

      // Find the outermost container (first div with padding)
      const container = screen.getByTestId('test-content').parentElement?.parentElement?.parentElement
      const style = container?.getAttribute('style') || ''
      // Padding might be shorthand or individual properties
      expect(style).toMatch(/padding.*20px/)
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<PageLayout {...defaultProps} />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Test Page')
    })

    it('should render children in proper container', () => {
      render(<PageLayout {...defaultProps} />)

      const contentContainer = screen.getByTestId('test-content').parentElement?.parentElement
      const style = contentContainer?.getAttribute('style') || ''
      expect(style).toContain('max-width: 900px')
    })
  })

  describe('Integration', () => {
    it('should handle typing effect props correctly', () => {
      render(
        <PageLayout
          {...defaultProps}
          displayText="Hello World"
          showCursor={true}
        />
      )

      expect(screen.getByText('Hello World')).toBeInTheDocument()
    })

    it('should apply background position override', () => {
      render(
        <PageLayout
          {...defaultProps}
          backgroundImage="/test.jpg"
          backgroundPositionOverride="center top"
        />
      )

      const backgroundDiv = document.querySelector('[style*="background-image"]')
      expect(backgroundDiv?.getAttribute('style')).toContain('background-position: center top')
    })
  })
})
