import { useEffect, useState } from 'react'
import { activeFont } from '@/design/fonts'

type Page = 'home' | 'about' | 'music' | 'live-sets' | 'shows' | 'contact'

interface HomeProps {
  onNavigate: (page: Page) => void
}

function Home({ onNavigate }: HomeProps) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<Page | null>(null)
  const fullText = 'Suite 52'

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Load Ubuntu Mono font
    const link = document.createElement('link')
    link.href = activeFont.googleFontsUrl
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // Typing animation with expressive timing
    const timings = [
      150, // S
      80,  // u - faster
      90,  // i
      70,  // t - fast
      110, // e
      200, // (pause before space)
      100, // 5
      85,  // 2
    ]

    let currentIndex = 0
    
    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex + 1))
        currentIndex++
        const delay = timings[currentIndex - 1] || 100
        setTimeout(typeNextChar, delay)
      } else {
        // After typing is done, slow down cursor blink then stop
        setTimeout(() => {
          setShowCursor(false)
        }, 1500)
      }
    }

    // Start typing after a brief delay
    const startDelay = setTimeout(() => {
      typeNextChar()
    }, 300)

    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    return () => {
      window.removeEventListener('resize', checkMobile)
      document.head.removeChild(link)
      clearTimeout(startDelay)
      clearInterval(cursorInterval)
    }
  }, [])

  const navLinks: { page: Page; label: string }[] = [
    { page: 'music', label: 'MUSIC' },
    { page: 'shows', label: 'SHOWS' },
    { page: 'live-sets', label: 'LIVE_SETS' },
    { page: 'about', label: 'ABOUT' },
    { page: 'contact', label: 'CONTACT' },
  ]

  const POKER_RED = '#e63946'
  const WHITE = '#ffffff'

  return (
    <div 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      <div style={{ textAlign: 'center', padding: isMobile ? '0 20px' : '0' }}>
        <h1 
          style={{ 
            color: '#ffffff',
            fontSize: isMobile ? '48px' : '96px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            fontFamily: activeFont.family,
            marginBottom: isMobile ? '4px' : '8px',
            marginTop: 0,
            minHeight: isMobile ? '60px' : '120px', // Prevent layout shift
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span>
            {displayText}
            <span 
              style={{ 
                opacity: showCursor ? 1 : 0,
                transition: 'opacity 0.1s',
              }}
            >
              |
            </span>
          </span>
        </h1>
        
        <p 
          style={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: isMobile ? '14px' : '20px',
            letterSpacing: '0.05em',
            fontFamily: activeFont.family,
            margin: 0,
            marginBottom: isMobile ? '16px' : '20px',
            opacity: displayText.length === fullText.length ? 1 : 0,
            transition: 'opacity 0.8s ease-in 0.8s',
          }}
        >
          Producer // DJ // Artist
        </p>

        {/* Floating navigation links */}
        <nav
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '8px' : '24px',
            flexWrap: 'wrap',
            padding: isMobile ? '0 10px' : '0',
            maxWidth: isMobile ? '320px' : '100%',
          }}
        >
          {navLinks.map((link, index) => {
            const isHovered = hoveredLink === link.page
            const baseDelay = 1.2 // Base delay after typing animation
            const staggerDelay = index * 0.15 // 150ms delay between each button (slower)
            const isVisible = displayText.length === fullText.length
            
            return (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                onMouseEnter={() => setHoveredLink(link.page)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  color: isHovered ? POKER_RED : WHITE,
                  fontSize: isMobile ? '12px' : '16px',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  fontFamily: activeFont.family,
                  textTransform: 'uppercase',
                  transition: `opacity 0.8s ease-out ${baseDelay + staggerDelay}s, transform 0.8s ease-out ${baseDelay + staggerDelay}s, color 0.2s ease-out, border-bottom 0.2s ease-out`,
                  padding: isMobile ? '8px 8px' : '10px 16px',
                  borderBottom: isHovered ? `2px solid ${POKER_RED}` : '2px solid transparent',
                  flexBasis: isMobile ? 'calc(33.333% - 6px)' : 'auto',
                  minWidth: isMobile ? 'fit-content' : 'auto',
                  opacity: isVisible ? 1 : 0,
                  transform: isHovered 
                    ? 'translateY(-2px)' 
                    : isVisible 
                      ? 'translateY(0)' 
                      : 'translateY(16px)',
                }}
              >
                {link.label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Home
