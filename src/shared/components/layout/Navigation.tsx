/**
 * Navigation - Suite 52 header navigation
 * Elegant, responsive navigation with red accents
 */

import { useState, useEffect, useMemo } from 'react'
import { activeFont } from '@/themes'
import { useNavigate } from 'react-router-dom'

type Page = 'home' | 'about' | 'music' | 'live-sets' | 'shows' | 'contact'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [hoveredLink, setHoveredLink] = useState<Page | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const navigate = useNavigate()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight < 768)
      setViewportWidth(window.innerWidth)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const navLinks: { page: Page; label: string }[] = [
    { page: 'music', label: 'MUSIC' },
    { page: 'shows', label: 'SHOWS' },
    { page: 'live-sets', label: 'LIVE' },
    { page: 'about', label: 'ABOUT' },
    { page: 'contact', label: 'CONTACT' },
  ]

  // Responsive values
  const navFontSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minSize = 13
    const maxSize = 15
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const size = minSize + (maxSize - minSize) * ratio
    
    return `${size}px`
  }, [viewportWidth])

  const navGap = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minGap = 2
    const maxGap = 16
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const gap = minGap + (maxGap - minGap) * ratio
    
    return `${gap}px`
  }, [viewportWidth])

  const buttonPadding = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    
    const vertPadding = 8 + (10 - 8) * ratio
    const horizPadding = 4 + (12 - 4) * ratio
    
    return `${vertPadding}px ${horizPadding}px`
  }, [viewportWidth])

  const handleHomeClick = () => {
    navigate('/')
  }

  const BLOOD = '#e63946'
  const WHITE = '#ffffff'

  return (
    <nav
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        width: '100%',
        padding: '12px 0',
        position: 'fixed',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        fontFamily: activeFont.family,
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {/* Logo/Home Link */}
        <button
          onClick={handleHomeClick}
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            color: WHITE,
            fontSize: '18px',
            fontWeight: '700',
            fontFamily: activeFont.family,
            letterSpacing: '-0.02em',
            padding: '6px 10px 6px 0',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = BLOOD
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = WHITE
          }}
        >
          Suite 52
        </button>

        {/* Nav Links */}
        <div 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: navGap,
          }}
        >
          {navLinks.map((link) => {
            const isHovered = hoveredLink === link.page
            const isActive = currentPage === link.page
            
            return (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  color: isActive ? BLOOD : isHovered ? WHITE : 'rgba(255, 255, 255, 0.7)',
                  fontSize: navFontSize,
                  fontWeight: isActive ? '700' : '500',
                  letterSpacing: '0.08em',
                  fontFamily: activeFont.family,
                  textTransform: 'uppercase',
                  position: 'relative',
                  padding: buttonPadding,
                  transition: 'all 0.2s ease',
                  transform: isHovered && !isActive ? 'translateY(-1px)' : 'translateY(0)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={() => setHoveredLink(link.page)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.label}
                
                {/* Active indicator */}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      backgroundColor: BLOOD,
                      borderRadius: '50%',
                      boxShadow: '0 0 8px rgba(230, 57, 70, 0.6)',
                    }}
                  />
                )}
                
                {/* Hover underline */}
                {isHovered && !isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: '1px',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
