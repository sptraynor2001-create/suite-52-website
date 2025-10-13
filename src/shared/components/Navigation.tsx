import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { colors } from '@/design'

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/music', label: 'Music' },
    { to: '/live-sets', label: 'Live Sets' },
    { to: '/shows', label: 'Shows' },
    { to: '/contact', label: 'Contact' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav 
      className="backdrop-blur-md sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: colors.border.default,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl sm:text-2xl font-display font-bold transition-all duration-200 hover:opacity-80"
              style={{ color: colors.text.primary }}
            >
              SUITE 52
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className="text-sm font-semibold uppercase tracking-wider transition-all duration-200 hover:opacity-100"
                style={{
                  color: isActive(link.to) ? colors.text.primary : colors.text.secondary,
                  opacity: isActive(link.to) ? 1 : 0.8,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 transition-all duration-200"
              style={{ color: colors.text.primary }}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {!isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden border-t backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            borderColor: colors.border.default,
          }}
        >
          <div className="px-4 pt-4 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-3 text-base font-semibold uppercase tracking-wider transition-all duration-200"
                style={{
                  color: isActive(link.to) ? colors.text.primary : colors.text.secondary,
                  borderBottom: `1px solid ${colors.border.subtle}`,
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation
