import { useEffect, useRef, useState } from 'react'
import { activeFont } from '@/design/fonts'

type Page = 'home' | 'about' | 'music' | 'live-sets' | 'shows' | 'contact'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navContainerRef = useRef<HTMLDivElement>(null)
  const outerContainerRef = useRef<HTMLElement>(null)
  const [hoveredLink, setHoveredLink] = useState<Page | null>(null)

  const navLinks: { page: Page; label: string }[] = [
    { page: 'home', label: 'HOME' },
    { page: 'music', label: 'MUSIC' },
    { page: 'shows', label: 'SHOWS' },
    { page: 'live-sets', label: 'LIVE SETS' },
    { page: 'about', label: 'ABOUT' },
    { page: 'contact', label: 'CONTACT' },
  ]

  useEffect(() => {
    if (navContainerRef.current && outerContainerRef.current) {
      const rect = navContainerRef.current.getBoundingClientRect()
      const outerRect = outerContainerRef.current.getBoundingClientRect()
      console.log('📐 Navigation dimensions:', {
        innerWidth: rect.width,
        outerWidth: outerRect.width,
        height: outerRect.height,
        screenWidth: window.innerWidth,
        innerPercentage: (rect.width / window.innerWidth * 100).toFixed(2) + '%',
        outerPercentage: (outerRect.width / window.innerWidth * 100).toFixed(2) + '%',
        position: window.getComputedStyle(outerContainerRef.current).position,
        font: activeFont.name
      })
    }
  }, [])

  const POKER_RED = '#e63946'
  const WHITE = '#ffffff'

  return (
    <nav 
      ref={outerContainerRef}
      style={{ 
        backgroundColor: '#000000',
        width: '100%',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
        fontFamily: activeFont.family
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div 
          ref={navContainerRef}
          style={{ 
            width: '70%',
            maxWidth: '1200px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px'
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
                    console.log('🔗 Navigating to:', link.page, link.label)
                    onNavigate(link.page)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    color: active ? POKER_RED : WHITE,
                    fontSize: '14px',
                    fontWeight: '700',
                    fontStyle: active ? 'italic' : 'normal',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease-out',
                    fontFamily: activeFont.family,
                    textTransform: 'uppercase',
                    position: 'relative',
                    padding: '8px 4px',
                    display: 'inline-block',
                    borderBottom: (isHovered && !active) ? `2px solid ${WHITE}` : '2px solid transparent',
                  }}
                  onMouseEnter={() => {
                    console.log('🖱️ Hover on:', link.label)
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
