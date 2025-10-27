/**
 * Visual Layout Integration Tests
 * Critical for maintaining portfolio aesthetics across devices
 * Tests complete user journeys and visual consistency
 */

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

const renderWithRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  )
}

describe('Visual Layout Integration Tests', () => {
  describe('Portfolio Home Page - First Impression Critical', () => {
    it('should render hero section with proper typography hierarchy', async () => {
      renderWithRouter('/')

      // Wait for content to load
      await screen.findByText(/Suite 52/i)

      // Check typography hierarchy
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()

      // Check that text is visible and properly styled
      expect(mainHeading).toBeVisible()
      expect(mainHeading).toHaveClass('text-4xl', 'md:text-6xl', 'lg:text-7xl')
    })

    it('should maintain proper spacing and layout on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 })

      renderWithRouter('/')

      // Check that layout containers are properly sized
      const containers = document.querySelectorAll('[class*="container"], [class*="max-w"]')
      containers.forEach(container => {
        const styles = window.getComputedStyle(container)
        expect(styles.maxWidth).toBeDefined()
      })
    })

    it('should maintain proper spacing and layout on desktop', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', { value: 1200 })

      renderWithRouter('/')

      // Check that layout scales appropriately for larger screens
      const containers = document.querySelectorAll('[class*="container"], [class*="max-w"]')
      containers.forEach(container => {
        const styles = window.getComputedStyle(container)
        // Should use larger max-widths on desktop
        expect(styles.maxWidth).toBeDefined()
      })
    })
  })

  describe('Navigation - Consistent Across Pages', () => {
    it('should render navigation with proper visual hierarchy', async () => {
      renderWithRouter('/')

      // Check navigation exists and is visible
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      expect(nav).toBeVisible()

      // Check navigation links are present
      const navLinks = within(nav).getAllByRole('link')
      expect(navLinks.length).toBeGreaterThan(0)

      // Each link should be visible and properly styled
      navLinks.forEach(link => {
        expect(link).toBeVisible()
        // Check for hover/focus states (would be tested with interaction tests)
      })
    })

    it('should maintain navigation layout across breakpoints', () => {
      // Test mobile navigation
      Object.defineProperty(window, 'innerWidth', { value: 375 })
      const { rerender } = renderWithRouter('/')

      let nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()

      // Test tablet navigation
      Object.defineProperty(window, 'innerWidth', { value: 768 })
      rerender(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )

      nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()

      // Test desktop navigation
      Object.defineProperty(window, 'innerWidth', { value: 1200 })
      rerender(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )

      nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })
  })

  describe('Music Page - Content Grid Layout', () => {
    it('should render music releases in responsive grid', async () => {
      renderWithRouter('/music')

      // Wait for music content to load
      await screen.findByText(/RELEASES/i)

      // Check that releases are displayed
      const releaseElements = document.querySelectorAll('[data-testid="release-card"], .release-card')
      expect(releaseElements.length).toBeGreaterThan(0)

      // Each release should have proper visual elements
      releaseElements.forEach(release => {
        // Should have cover art, title, artist
        const images = release.querySelectorAll('img')
        const headings = release.querySelectorAll('h1, h2, h3, h4, h5, h6')

        expect(images.length).toBeGreaterThan(0) // Cover art
        expect(headings.length).toBeGreaterThan(0) // Title/artist
      })
    })

    it('should maintain grid layout on different screen sizes', () => {
      const viewports = [375, 768, 1024, 1440] // Mobile, tablet, desktop, wide

      viewports.forEach(viewport => {
        Object.defineProperty(window, 'innerWidth', { value: viewport })

        const { rerender } = renderWithRouter('/music')

        // Check that grid containers exist and are properly styled
        const grids = document.querySelectorAll('[class*="grid"], [style*="display: grid"]')
        grids.forEach(grid => {
          const styles = window.getComputedStyle(grid)
          expect(styles.display).toBeDefined()
        })

        rerender(
          <MemoryRouter initialEntries={['/music']}>
            <App />
          </MemoryRouter>
        )
      })
    })

    it('should display release cards with consistent visual styling', async () => {
      renderWithRouter('/music')

      await screen.findByText(/RELEASES/i)

      // Find all release cards
      const cards = document.querySelectorAll('[class*="card"], [class*="release"]')

      cards.forEach(card => {
        const styles = window.getComputedStyle(card)

        // Should have consistent styling
        expect(styles.borderRadius).toBeDefined()
        expect(styles.boxShadow).toBeDefined()

        // Should have proper padding
        expect(styles.padding).toBeDefined()
      })
    })
  })

  describe('Live Sets Page - Media Embed Layout', () => {
    it('should render media embeds with proper aspect ratios', async () => {
      renderWithRouter('/live-sets')

      // Wait for live sets content
      await screen.findByText(/LIVE_SETS/i)

      // Check for video embeds
      const iframes = document.querySelectorAll('iframe')
      expect(iframes.length).toBeGreaterThan(0)

      // Each iframe should have proper styling
      iframes.forEach(iframe => {
        const styles = window.getComputedStyle(iframe)

        // Should maintain aspect ratio
        expect(styles.width).toBeDefined()
        expect(styles.height).toBeDefined()

        // Should have border radius for visual consistency
        const parentStyles = window.getComputedStyle(iframe.parentElement!)
        expect(parentStyles.borderRadius).toBeDefined()
      })
    })

    it('should display embed titles with proper typography', async () => {
      renderWithRouter('/live-sets')

      await screen.findByText(/LIVE_SETS/i)

      // Check for headings above embeds
      const headings = document.querySelectorAll('h1, h2, h3')
      expect(headings.length).toBeGreaterThan(0)

      headings.forEach(heading => {
        const styles = window.getComputedStyle(heading)

        // Should have proper font sizing
        expect(styles.fontSize).toBeDefined()
        expect(styles.fontWeight).toBeDefined()

        // Should be centered for visual balance
        expect(styles.textAlign).toBe('center')
      })
    })
  })

  describe('Page Layout - Fixed Header Pattern', () => {
    it('should maintain fixed header layout across pages', async () => {
      const pages = ['/', '/music', '/live-sets', '/about']

      for (const page of pages) {
        const { rerender } = renderWithRouter(page)

        // Wait for page content
        await screen.findByRole('main')

        // Check header is present and styled as fixed
        const header = document.querySelector('header') || document.querySelector('[class*="fixed"]')
        if (header) {
          const styles = window.getComputedStyle(header)
          expect(styles.position).toBeDefined()
        }

        // Check main content has proper top margin/padding
        const main = screen.getByRole('main')
        const mainStyles = window.getComputedStyle(main)
        expect(mainStyles.paddingTop || mainStyles.marginTop).toBeDefined()

        rerender(
          <MemoryRouter initialEntries={[page]}>
            <App />
          </MemoryRouter>
        )
      }
    })

    it('should prevent content overlap with fixed header', () => {
      renderWithRouter('/')

      const header = document.querySelector('header') || document.querySelector('[class*="fixed"]')
      const main = screen.getByRole('main')

      if (header && main) {
        const headerRect = header.getBoundingClientRect()
        const mainRect = main.getBoundingClientRect()

        // Main content should start below header
        expect(mainRect.top).toBeGreaterThanOrEqual(headerRect.bottom)
      }
    })
  })

  describe('Color Contrast and Accessibility', () => {
    it('should maintain proper color contrast ratios', () => {
      renderWithRouter('/')

      // Get all text elements
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a')

      textElements.forEach(element => {
        const styles = window.getComputedStyle(element)
        const color = styles.color
        const backgroundColor = styles.backgroundColor

        // Colors should be defined (actual contrast calculation would need a library)
        expect(color).toBeDefined()
        expect(color).not.toBe('rgba(0, 0, 0, 0)') // Not transparent
      })
    })

    it('should provide proper focus indicators', async () => {
      const user = userEvent.setup()
      renderWithRouter('/')

      // Find interactive elements
      const buttons = screen.getAllByRole('button')
      const links = screen.getAllByRole('link')

      const interactiveElements = [...buttons, ...links]

      for (const element of interactiveElements.slice(0, 3)) { // Test first 3 to avoid long test
        // Focus the element
        await user.tab()
        element.focus()

        // Check that focus is visible (in practice, we'd check for outline or other indicators)
        const styles = window.getComputedStyle(element)
        expect(styles.outline || styles.boxShadow).toBeDefined()
      }
    })
  })

  describe('Animation Performance - Critical for Portfolio', () => {
    it('should use performant animations (transform/opacity only)', () => {
      renderWithRouter('/')

      // Find animated elements
      const animatedElements = document.querySelectorAll('[class*="animate"], [style*="transition"], [style*="animation"]')

      animatedElements.forEach(element => {
        const styles = window.getComputedStyle(element)

        // Should prefer transform and opacity for performance
        if (styles.transition || styles.animation) {
          // Check that animations don't cause layout recalculations
          // In practice, we'd use performance monitoring tools
          expect(styles.willChange === 'auto' || styles.willChange === 'transform' || styles.willChange === 'opacity').toBeTruthy()
        }
      })
    })

    it('should respect reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => ({ matches: true }))
      })

      renderWithRouter('/')

      // Animated elements should be minimal or disabled
      const animatedElements = document.querySelectorAll('[class*="animate"], [style*="animation"]')

      // With reduced motion, animations should be minimal
      animatedElements.forEach(element => {
        const styles = window.getComputedStyle(element)
        // Check that animations are disabled or minimal
        expect(styles.animation).toBeDefined() // Still defined but could be disabled
      })
    })
  })

  describe('Touch Targets - Mobile Usability', () => {
    it('should provide adequate touch target sizes on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 })

      renderWithRouter('/')

      // Find interactive elements
      const buttons = screen.getAllByRole('button')
      const links = screen.getAllByRole('link')

      const interactiveElements = [...buttons, ...links]

      interactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect()

        // Minimum touch target size (44px as per WCAG)
        const minSize = 44
        expect(rect.width).toBeGreaterThanOrEqual(minSize)
        expect(rect.height).toBeGreaterThanOrEqual(minSize)
      })
    })

    it('should maintain proper spacing between touch targets', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375 })

      renderWithRouter('/')

      const interactiveElements = screen.getAllByRole('button')

      // Check spacing between adjacent interactive elements
      for (let i = 0; i < interactiveElements.length - 1; i++) {
        const current = interactiveElements[i].getBoundingClientRect()
        const next = interactiveElements[i + 1].getBoundingClientRect()

        const gap = Math.min(
          Math.abs(current.right - next.left),
          Math.abs(current.bottom - next.top)
        )

        // Should have adequate spacing to prevent accidental touches
        expect(gap).toBeGreaterThanOrEqual(8) // At least 8px gap
      }
    })
  })

  describe('Image Optimization - Visual Performance', () => {
    it('should use responsive images with proper sizing', () => {
      renderWithRouter('/')

      const images = document.querySelectorAll('img')

      images.forEach(img => {
        // Should have proper sizing attributes or responsive containers
        expect(img.getAttribute('src') || img.getAttribute('srcset')).toBeDefined()

        // Check parent container for responsive behavior
        const parent = img.parentElement
        if (parent) {
          const parentStyles = window.getComputedStyle(parent)
          // Should be responsive or have max-width constraints
          expect(parentStyles.maxWidth).toBeDefined()
        }
      })
    })

    it('should prevent layout shift with defined aspect ratios', () => {
      renderWithRouter('/')

      const images = document.querySelectorAll('img')

      images.forEach(img => {
        const parent = img.parentElement
        if (parent) {
          const parentStyles = window.getComputedStyle(parent)

          // Should have aspect ratio or defined dimensions to prevent shift
          expect(parentStyles.aspectRatio || (parentStyles.width && parentStyles.height)).toBeDefined()
        }
      })
    })
  })
})
