import { useState } from 'react'
import { activeFont } from '@/design/fonts'

type Page = 'home' | 'about' | 'music' | 'live-sets' | 'shows' | 'contact'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [hoveredLink, setHoveredLink] = useState<Page | null>(null)

  const navLinks: { page: Page; label: string }[] = [
    { page: 'home', label: 'HOME' },
    { page: 'music', label: 'MUSIC' },
    { page: 'shows', label: 'SHOWS' },
    { page: 'live-sets', label: 'LIVE_SETS' },
    { page: 'about', label: 'ABOUT' },
    { page: 'contact', label: 'CONTACT' },
  ]


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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div 
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
                    transform: (isHovered && !active) ? 'translateY(-2px)' : 'translateY(0)', // Lift up on hover
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
