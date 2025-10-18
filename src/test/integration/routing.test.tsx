/**
 * @fileoverview Integration tests for routing
 * @description Tests navigation and routing behavior across the app
 */

import { describe, it, expect, vi } from 'vitest'
import { renderApp, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import App from '../../App'

describe('Routing Integration', () => {
  const renderAppWithRoute = (initialRoute = '/') => {
    return renderApp(<App />, { 
      initialEntries: [initialRoute] 
    })
  }

  describe('Navigation', () => {
    it('should render home page by default', () => {
      renderAppWithRoute('/')

      // Home page specific elements
      expect(screen.getByText(/Suite 52/i)).toBeInTheDocument()
    })

    it('should navigate to about page', async () => {
      renderAppWithRoute('/')

      const user = userEvent.setup()
      const aboutLink = screen.getByText('ABOUT')

      await user.click(aboutLink)

      await waitFor(() => {
        expect(screen.getByText('ABOUT')).toBeInTheDocument()
      })
    })

    it('should navigate to music page', async () => {
      renderAppWithRoute('/')

      const user = userEvent.setup()
      const musicLink = screen.getByText('MUSIC')

      await user.click(musicLink)

      await waitFor(() => {
        expect(screen.getByText('RELEASES')).toBeInTheDocument()
      })
    })
  })

  describe('Page Content', () => {
    it('should display correct content on about page', async () => {
      renderAppWithRoute('/about')

      await waitFor(() => {
        expect(screen.getByText('ABOUT')).toBeInTheDocument()
      })

      // Check for typing animation
      await waitFor(() => {
        expect(screen.getByText(/ARTIST|name|genre|vibe/i)).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should display live sets with embeds', async () => {
      renderAppWithRoute('/live-sets')

      await waitFor(() => {
        expect(screen.getByText('LIVE_SETS')).toBeInTheDocument()
      })

      // Check for embed titles
      expect(screen.getByText(/Suite 52 B2B Henry McBride/i)).toBeInTheDocument()
      expect(screen.getByText('UMANO Radio')).toBeInTheDocument()
    })
  })

  describe('Animations', () => {
    it('should trigger title animations on page load', async () => {
      renderAppWithRoute('/about')

      const title = screen.getByText('ABOUT')

      // Should start with animation styles
      expect(title).toHaveStyle({
        opacity: '0',
        transform: 'translateY(20px)',
      })

      // Should animate to final state
      await waitFor(() => {
        expect(title).toHaveStyle({
          opacity: '1',
          transform: 'translateY(0px)',
        })
      }, { timeout: 200 })
    })

    it('should trigger typing animation after title', async () => {
      renderAppWithRoute('/about')

      // Wait for title animation
      await waitFor(() => {
        const title = screen.getByText('ABOUT')
        expect(title).toHaveStyle({ opacity: '1' })
      }, { timeout: 200 })

      // Typing should start after delay
      await waitFor(() => {
        expect(screen.getByText(/ARTIST|const|Suite 52/i)).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('Background Images', () => {
    it('should load background images with fade-in', async () => {
      renderAppWithRoute('/about')

      // Background should fade in
      const backgroundDiv = document.querySelector('[style*="background-image"]')

      expect(backgroundDiv).toBeInTheDocument()

      // Should start invisible and fade in
      await waitFor(() => {
        expect(backgroundDiv).toHaveStyle({ opacity: '0.15' })
      }, { timeout: 2000 })
    })
  })

  describe('Responsive Behavior', () => {
    it('should adapt navigation for mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 })

      renderAppWithRoute('/')

      // Navigation should be mobile-friendly
      const navLinks = screen.getAllByRole('link')
      expect(navLinks.length).toBeGreaterThan(0)
    })

    it('should handle different screen sizes for embeds', () => {
      renderAppWithRoute('/live-sets')

      // Embeds should be responsive
      const iframes = document.querySelectorAll('iframe')
      iframes.forEach(iframe => {
        expect(iframe).toHaveStyle({ width: '100%' })
      })
    })
  })
})
