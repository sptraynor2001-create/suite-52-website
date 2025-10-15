import { useState, useEffect, useMemo } from 'react'
import { activeFont } from '@/design/fonts'

type Page = 'home' | 'about' | 'music' | 'live-sets' | 'shows' | 'contact'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [hoveredLink, setHoveredLink] = useState<Page | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)

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
    { page: 'live-sets', label: 'LIVE_SETS' },
    { page: 'about', label: 'ABOUT' },
    { page: 'contact', label: 'CONTACT' },
  ]

  // Responsive font size - minimal variation, larger on mobile
  const navFontSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minSize = 15 // Much larger minimum for mobile
    const maxSize = 16 // Less variation
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const size = minSize + (maxSize - minSize) * ratio
    
    return `${size}px`
  }, [viewportWidth, isMobile])

  // Responsive gap - very tight on mobile
  const navGap = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minGap = 2 // Very tight spacing on mobile
    const maxGap = 8
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const gap = minGap + (maxGap - minGap) * ratio
    
    return `${gap}px`
  }, [viewportWidth, isMobile])

  // Responsive container width
  const navWidth = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minPercent = 95
    const maxPercent = 70
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const percent = minPercent + (maxPercent - minPercent) * ratio
    
    return `${percent}%`
  }, [viewportWidth])

  // Responsive container padding
  const containerPadding = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    
    // Interpolate padding
    const vertPadding = 4 + (8 - 4) * ratio
    const horizPadding = 8 // Keep consistent
    
    return `${vertPadding}px ${horizPadding}px`
  }, [viewportWidth])

  // Responsive button padding
  const buttonPadding = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    
    // Interpolate padding
    const vertPadding = 6 + (8 - 6) * ratio
    const horizPadding = 2 + (4 - 2) * ratio
    
    return `${vertPadding}px ${horizPadding}px`
  }, [viewportWidth])

  const POKER_RED = '#e63946'
  const WHITE = '#ffffff'

  return (
    <nav 
      style={{ 
        backgroundColor: '#000000',
        width: '100%',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
        fontFamily: activeFont.family
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <div 
          style={{ 
            width: navWidth,
            maxWidth: '1200px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: containerPadding,
            gap: navGap,
          }}
        >
          {navLinks.map((link) => {
            const isHovered = hoveredLink === link.page
            const active = currentPage === link.page
            
            return (
              <div
                key={link.page}
                style={{
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                <button
                  onClick={() => {
                    onNavigate(link.page)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    color: active ? POKER_RED : WHITE,
                    fontSize: navFontSize,
                    fontWeight: '700',
                    fontStyle: active ? 'italic' : 'normal',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease-out',
                    fontFamily: activeFont.family,
                    textTransform: 'uppercase',
                    position: 'relative',
                    padding: buttonPadding,
                    display: 'inline-block',
                    borderBottom: (isHovered && !active) ? `2px solid ${WHITE}` : '2px solid transparent',
                    transform: (isHovered && !active) ? 'translateY(-2px)' : 'translateY(0)', // Lift up on hover
                    whiteSpace: 'nowrap',
                  }}
                      onMouseEnter={() => {
                        setHoveredLink(link.page)
                      }}
                  onMouseLeave={() => {
                    setHoveredLink(null)
                  }}
                >
                  {link.label}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
