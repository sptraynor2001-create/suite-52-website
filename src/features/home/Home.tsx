import { useEffect, useState, useMemo } from 'react'
import { activeFont } from '@/design/fonts'
import BouncingSquare from '@/shared/components/BouncingSquare'

type Page = 'home' | 'about' | 'music' | 'live-sets' | 'shows' | 'contact'

interface HomeProps {
  onNavigate: (page: Page) => void
}

function Home({ onNavigate }: HomeProps) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)
  const [hoveredLink, setHoveredLink] = useState<Page | null>(null)
  const [philosophicalText, setPhilosophicalText] = useState('')
  const [showPhilosophicalCursor, setShowPhilosophicalCursor] = useState(false)
  const [isPhilosophicalTyping, setIsPhilosophicalTyping] = useState(false)
  const fullText = 'Suite 52'
  const fullPhilosophicalText = 'SOUND IS REBELLION AGAINST SILENCE. MUSIC SPEAKS WHAT LOGIC CANNOT DECODE. ALGORITHMS SEARCH FOR PATTERNS WHILE HUMAN BEINGS SEARCH FOR PURPOSE. CULTURE LIVES BETWEEN TRADITION AND TRANSFORMATION. FREEDOM EMERGES WHEN SPIRIT GUIDES TRANSMISSION. THE SIGNAL SEARCHES FOR THOSE WILLING TO LISTEN, THE MELODY FINDS THOSE WILLING TO FEEL, AND THE RHYTHM ONLY UNDERSTOOD BY THOSE WILLING TO MOVE.'

  useEffect(() => {
    // Check if mobile and track viewport width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setViewportWidth(window.innerWidth)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Load Ubuntu Mono font
    const link = document.createElement('link')
    link.href = activeFont.googleFontsUrl
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // Typing animation with expressive timing (slower)
    const timings = [
      220, // S
      120,  // u - faster
      130,  // i
      100,  // t - fast
      160, // e
      300, // (pause before space)
      150, // 5
      125,  // 2
    ]

    let currentIndex = 0
    
    // Cursor blink - declare first so it can be cleared in typeNextChar
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    
    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex + 1))
        currentIndex++
        const delay = timings[currentIndex - 1] || 100
        setTimeout(typeNextChar, delay)
      } else {
        // Stop blinking and hide cursor when typing completes
        clearInterval(cursorInterval)
        setShowCursor(false)
      }
    }

    // Start typing after a brief delay
    const startDelay = setTimeout(() => {
      setShowCursor(true) // Show cursor when typing starts
      typeNextChar()
    }, 300)

    return () => {
      window.removeEventListener('resize', checkMobile)
      document.head.removeChild(link)
      clearTimeout(startDelay)
      clearInterval(cursorInterval)
    }
  }, [])

  // Typing animation for philosophical text
  useEffect(() => {
    // Start after main title animation completes and buttons appear (adjusted for slower typing: ~3.5s total)
    const startDelay = setTimeout(() => {
      setIsPhilosophicalTyping(true)
      setShowPhilosophicalCursor(true)
      let currentIndex = 0
      
      const typeNextChar = () => {
        if (currentIndex < fullPhilosophicalText.length) {
          setPhilosophicalText(fullPhilosophicalText.substring(0, currentIndex + 1))
          currentIndex++
          
          // Variable typing speed: 40-120ms per keystroke
          const delay = 40 + Math.random() * 80
          
          setTimeout(typeNextChar, delay)
        } else {
          setIsPhilosophicalTyping(false)
          // Hide cursor after typing is done
          setTimeout(() => {
            setShowPhilosophicalCursor(false)
          }, 1000)
        }
      }
      
      typeNextChar()
    }, 3500)

    return () => {
      clearTimeout(startDelay)
    }
  }, [])

  // Cursor management for philosophical text - solid while typing, blink after
  useEffect(() => {
    if (isPhilosophicalTyping) {
      // Keep cursor solid while typing
      setShowPhilosophicalCursor(true)
      return
    }
    
    // After typing is done, blink for a bit then hide
    if (philosophicalText.length === fullPhilosophicalText.length && philosophicalText.length > 0) {
      const cursorInterval = setInterval(() => {
        setShowPhilosophicalCursor(prev => !prev)
      }, 530)

      return () => {
        clearInterval(cursorInterval)
      }
    }
  }, [isPhilosophicalTyping, philosophicalText])

  const navLinks: { page: Page; label: string }[] = [
    { page: 'music', label: 'MUSIC' },
    { page: 'shows', label: 'SHOWS' },
    { page: 'live-sets', label: 'LIVE_SETS' },
    { page: 'about', label: 'ABOUT' },
    { page: 'contact', label: 'CONTACT' },
  ]

  const POKER_RED = '#e63946'
  const WHITE = '#ffffff'

  // Calculate smooth background size based on viewport width
  const getBackgroundSize = () => {
    // Smooth transition from 'cover' at wider widths to 'auto 100%' at narrower widths
    // Breakpoint around 768px (tablet/mobile threshold)
    if (viewportWidth >= 768) {
      return 'cover'
    } else {
      return 'auto 100%'
    }
  }

  // Generate grid positions and random velocities for squares - memoized so it only runs once
  const squares = useMemo(() => {
    const result = []
    const cols = 3
    const rows = 1
    const spacingX = window.innerWidth / (cols + 1)
    const spacingY = window.innerHeight / (rows + 1)
    
    const opacities = [0.015, 0.022, 0.018]
    
    let index = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col + 1) * spacingX
        const y = (row + 1) * spacingY
        
        // Random velocity between 0.15 and 0.35, random direction
        const velocityX = (Math.random() * 0.2 + 0.15) * (Math.random() > 0.5 ? 1 : -1)
        const velocityY = (Math.random() * 0.2 + 0.15) * (Math.random() > 0.5 ? 1 : -1)
        
        result.push({
          key: index,
          x,
          y,
          velocityX,
          velocityY,
          opacity: opacities[index]
        })
        
        index++
      }
    }
    
    return result
  }, [])

  return (
    <div 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {/* Background image - beneath everything */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url(/images/backgrounds/main-background.JPEG)',
          backgroundSize: getBackgroundSize(),
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15,
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'background-size 0.2s ease-out',
        }}
      />
      
      {squares.map(square => (
        <BouncingSquare 
          key={square.key}
          initialX={square.x} 
          initialY={square.y} 
          velocityX={square.velocityX} 
          velocityY={square.velocityY} 
          opacity={square.opacity} 
        />
      ))}
      <div style={{ textAlign: 'center', padding: isMobile ? '0 20px' : '0' }}>
        <h1 
          style={{ 
            color: '#ffffff',
            fontSize: isMobile ? '48px' : '96px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            fontFamily: activeFont.family,
            marginBottom: isMobile ? '2px' : '4px',
            marginTop: 0,
            display: 'inline-flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <span style={{ display: 'inline-block', position: 'relative' }}>
            {displayText}
            <span 
              style={{ 
                position: 'absolute',
                right: '-0.6em',
                top: '0',
                opacity: showCursor ? 1 : 0,
                transition: 'opacity 0.1s',
                lineHeight: 1,
                fontSize: '0.85em',
                transform: 'scaleX(0.7)',
                transformOrigin: 'left center',
              }}
            >
              █
            </span>
          </span>
        </h1>
        
        <p 
          style={{ 
            color: 'rgba(255, 255, 255, 0.25)',
            fontSize: isMobile ? '14px' : '20px',
            letterSpacing: '0.05em',
            fontFamily: activeFont.family,
            fontWeight: '700',
            margin: 0,
            marginBottom: isMobile ? '16px' : '20px',
            visibility: displayText.length === fullText.length ? 'visible' : 'hidden',
            opacity: displayText.length === fullText.length ? 1 : 0,
            transition: 'opacity 0.8s ease-in 0.8s',
          }}
        >
          Music Producer // DJ // Artist
        </p>

        {/* Philosophical text - subtle and hidden */}
        <div
          style={{
            position: 'fixed',
            bottom: isMobile ? '3px' : '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: isMobile ? '80%' : '57.5%',
            maxWidth: '775px',
            height: isMobile ? '55px' : '45px',
            textAlign: 'justify',
            fontSize: isMobile ? '6px' : 'min(8px, 0.75vw)',
            lineHeight: '1.4',
            color: '#00ff41',
            opacity: philosophicalText.length > 0 ? 0.25 : 0,
            fontFamily: activeFont.family,
            letterSpacing: '0.20em',
            fontWeight: '700',
            pointerEvents: 'none',
            transition: 'none',
            overflow: 'hidden',
            visibility: 'visible',
          }}
        >
          {philosophicalText}
          {showPhilosophicalCursor && (
            <span 
              style={{ 
                opacity: showPhilosophicalCursor ? 1 : 0,
                transition: 'opacity 0.1s',
              }}
            >
              █
            </span>
          )}
        </div>

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
                  transition: `opacity 0.8s ease-out ${baseDelay + staggerDelay}s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${isVisible ? '0s' : baseDelay + staggerDelay + 's'}, color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), margin 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                  padding: isMobile ? '8px 8px' : '10px 16px',
                  margin: (isHovered && !isMobile) ? '0 10px' : '0',
                  flexBasis: isMobile ? 'calc(33.333% - 6px)' : 'auto',
                  minWidth: isMobile ? 'fit-content' : 'auto',
                  visibility: isVisible ? 'visible' : 'hidden',
                  opacity: isVisible ? 1 : 0,
                  transform: (isHovered && !isMobile)
                    ? 'scale(1.3)' 
                    : isVisible 
                      ? 'translateY(0) scale(1)' 
                      : 'translateY(0) scale(1)',
                  filter: (isHovered && !isMobile) ? 'brightness(1.2)' : 'brightness(1)',
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
