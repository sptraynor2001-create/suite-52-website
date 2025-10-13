import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { colors, tokens } from '@/design'
import { GlowText } from './atoms'

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
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
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        borderColor: colors.border.default,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl sm:text-2xl font-display font-bold transition-all duration-300 hover:scale-105"
            >
              <GlowText variant="cyan" intensity="md">
                SUITE 52
              </GlowText>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className="inline-flex items-center px-1 pt-1 text-sm font-semibold uppercase tracking-wider transition-all duration-200"
                style={{
                  color: isActive(link.to) ? colors.text.primary : colors.text.secondary,
                  textShadow: isActive(link.to) ? tokens.shadows.glow.cyan.sm : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.text.primary
                  e.currentTarget.style.textShadow = tokens.shadows.glow.cyan.sm
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = colors.text.secondary
                    e.currentTarget.style.textShadow = 'none'
                  }
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
              className="inline-flex items-center justify-center p-2 rounded-md transition-all duration-200"
              style={{
                color: colors.text.primary,
              }}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            borderColor: colors.border.default,
          }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2 rounded-md text-base font-semibold uppercase tracking-wider transition-all duration-200"
                style={{
                  color: isActive(link.to) ? colors.text.primary : colors.text.secondary,
                  backgroundColor: isActive(link.to) ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
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
