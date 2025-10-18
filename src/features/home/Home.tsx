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
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)
  const fullText = 'Suite 52'
  const fullPhilosophicalText = 'SOUND IS A REBELLION AGAINST SILENCE, AND MUSIC SPEAKS WHAT LOGIC CANNOT DECODE. ALGORITHMS SEARCH FOR PATTERNS WHILE HUMANS SEARCH FOR MEANING. CULTURE LIVES BETWEEN TRADITION AND TRANSFORMATION, AND FREEDOM EMERGES WHEN SPIRIT GUIDES TRANSMISSION. THE SIGNAL SEARCHES FOR THOSE WILLING TO LISTEN, THE MELODY FINDS THOSE WILLING TO FEEL, AND THE RHYTHM IS ONLY UNDERSTOOD BY THOSE WILLING TO MOVE.'

  useEffect(() => {
    // Check if mobile and track viewport width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight < 768)
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
    let typingComplete = false
    
    // Cursor blink - declare first so it can be cleared in typeNextChar
    const cursorInterval = setInterval(() => {
      if (!typingComplete) {
        setShowCursor(prev => !prev)
      }
    }, 530)
    
    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex + 1))
        currentIndex++
        const delay = timings[currentIndex - 1] || 100
        setTimeout(typeNextChar, delay)
      } else {
        // Stop blinking and do quick flashes: off-fade on-off-on-off-on-hold-off
        typingComplete = true
        clearInterval(cursorInterval)
        setShowCursor(false)
        // Wait a moment then fade in (shorter delay for first flash)
        setTimeout(() => {
          setShowCursor(true)
          setTimeout(() => {
            setShowCursor(false)
            setTimeout(() => {
              setShowCursor(true)
              setTimeout(() => {
                setShowCursor(false)
                setTimeout(() => {
                  setShowCursor(true)
                  setTimeout(() => {
                    // Hold for normal duration (530ms)
                    setTimeout(() => {
                      setShowCursor(false)
                    }, 530)
                  }, 265)
                }, 265)
              }, 265)
            }, 265)
          }, 180)
        }, 400)
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

  // Preload background image
  useEffect(() => {
    const img = new Image()
    img.src = '/images/backgrounds/home-background.jpg'
    img.onload = () => {
      setBackgroundLoaded(true)
    }
  }, [])

  // Clear hovered state when component mounts (when returning to home page)
  useEffect(() => {
    setHoveredLink(null)
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

  // Calculate smooth background size based on viewport aspect ratio
  const getBackgroundSize = () => {
    // On mobile/portrait: make image BIGGER than viewport so positioning works
    // On desktop/landscape: constrain by width
    const aspectRatio = viewportWidth / window.innerHeight
    
    if (aspectRatio < 0.8) {
      // Portrait/mobile: make image 150% of viewport height so we can crop/position it
      return 'auto 150%'
    } else {
      // Landscape/desktop: constrain by width
      return '100% auto'
    }
  }

  // Calculate smooth background position - pinned to top on mobile, centered on desktop
  const getBackgroundPosition = () => {
    const minWidth = 375 // Mobile minimum
    const maxWidth = 1920 // Desktop maximum
    
    // Calculate ratio: 0 at mobile, 1 at desktop
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    
    // Ease-out transition - stays very high near desktop value, minimal dip throughout
    // Mobile: 95% (subject positioned high), Desktop: 52.5% (centered, subject visible)
    // Using very small exponent to minimize dip in middle ranges
    const easedRatio = Math.pow(ratio, 0.25) // Very aggressive curve - stays high almost entire transition
    const verticalPercent = 95 + (easedRatio * -42.5) // Range from 95% down to 52.5%
    
    return `center ${verticalPercent}%`
  }

  // Calculate nav width based on viewport - scale from 45% (desktop) to 95% (mobile)
  const getNavWidth = () => {
    const minWidth = 375 // Mobile minimum
    const maxWidth = 1920 // Desktop maximum
    const minPercent = 95 // Mobile: 95%
    const maxPercent = 45 // Desktop: 45% (tighter grouping)
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const percent = minPercent + (maxPercent - minPercent) * ratio
    
    return `${percent}%`
  }

  // Fixed text sizes for all screen sizes
  const titleFontSize = '70px' // Fixed size
  const subtitleFontSize = '18px' // Fixed size
  const navFontSize = '16px' // Fixed size

  // Memoize nav button gap - very tight on mobile
  const navGap = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minGap = 2 // Very tight spacing on mobile
    const maxGap = 12 // Less spread out on desktop
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const gap = minGap + (maxGap - minGap) * ratio
    
    return `${gap}px`
  }, [viewportWidth, isMobile])

  // Memoize nav button padding - smooth transition
  const navPadding = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    
    const vertPadding = 10 // Keep consistent
    const horizPadding = 8 + (16 - 8) * ratio // 8px mobile to 16px desktop
    
    return `${vertPadding}px ${horizPadding}px`
  }, [viewportWidth])

  // Check if we're in mobile range for hover effects
  const isMobileRange = useMemo(() => {
    return viewportWidth < 768 // Consider < 768px as mobile range
  }, [viewportWidth])

  // Fixed vertical spacing for all screen sizes
  const titleMarginBottom = '3px' // Fixed spacing
  const subtitleMarginBottom = '15px' // Fixed spacing
  const cursorWidth = '24px' // Fixed width
  const cursorHeight = '48px' // Fixed height (slightly taller)

  // Memoize horizontal blur amount - more on desktop, less on mobile
  const horizontalBlur = useMemo(() => {
    const minWidth = 375 // Mobile minimum
    const maxWidth = 1920 // Desktop maximum
    const minBlur = 12 // Mobile: current blur (threshold)
    const maxBlur = 24 // Desktop: more blurry
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const blur = minBlur + (maxBlur - minBlur) * ratio
    
    return blur
  }, [viewportWidth])

  // Memoize philosophical text properties - smooth transitions
  const philosophicalFontSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minSize = 6 // Mobile font size
    const maxSize = 7.5 // Desktop font size

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const size = minSize + (maxSize - minSize) * ratio

    return `${size}px`
  }, [viewportWidth])

  const philosophicalBottom = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)

    // On mobile, position it higher to ensure it doesn't cause scrolling
    const bottom = isMobile ? 2 : (0.5 + (1 - 0.5) * ratio) // 2px on mobile, 0.5-1px on desktop
    return `${bottom}px`
  }, [viewportWidth, isMobile])

  const philosophicalHeight = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)

    // Mobile: smaller height to prevent scrolling, Desktop: normal height
    const height = isMobile ? 35 : (45 + (35 - 45) * ratio) // 35px on mobile, 35-45px on desktop
    return `${height}px`
  }, [viewportWidth, isMobile])

  // Generate random positions and velocities for squares - memoized so it only runs once
  const squares = useMemo(() => {
    const result = []
    const numSquares = 2
    const sizePercent = 0.9 // 90% of smaller viewport dimension for both
    
    for (let index = 0; index < numSquares; index++) {
      const smallerDimension = Math.min(window.innerWidth, window.innerHeight)
      const squareSize = smallerDimension * sizePercent
      
      // Random position within valid bounds
      const maxX = Math.max(0, window.innerWidth - squareSize)
      const maxY = Math.max(0, window.innerHeight - squareSize)
      const x = Math.random() * maxX
      const y = Math.random() * maxY
      
      // Random velocity between 0.15 and 0.35, random direction
      const velocityX = (Math.random() * 0.2 + 0.15) * (Math.random() > 0.5 ? 1 : -1)
      const velocityY = (Math.random() * 0.2 + 0.15) * (Math.random() > 0.5 ? 1 : -1)
      
      result.push({
        key: index,
        x,
        y,
        velocityX,
        velocityY,
        sizePercent
      })
    }
    
    return result
  }, [])

  return (
    <div 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* SVG filter for horizontal motion blur and grayscale */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="horizontalMotionBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation={`${horizontalBlur},0`} result="blur" />
            {/* Convert to grayscale */}
            <feColorMatrix in="blur" type="matrix" values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>
      
      {/* Background image - beneath everything */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url(/images/backgrounds/home-background.jpg)',
          backgroundSize: getBackgroundSize(),
          backgroundPosition: getBackgroundPosition(),
          backgroundRepeat: 'no-repeat',
          opacity: backgroundLoaded ? 0.28 : 0,
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'opacity 1.5s ease-in',
          filter: 'url(#horizontalMotionBlur)',
        }}
      />
      
      {/* Black overlay to darken the image */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        opacity: 0.10,
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      
      
      {/* Only show bouncing squares on desktop to prevent mobile scrolling issues */}
      {!isMobile && squares.map(square => (
        <BouncingSquare
          key={square.key}
          initialX={square.x}
          initialY={square.y}
          velocityX={square.velocityX}
          velocityY={square.velocityY}
          sizePercent={square.sizePercent}
        />
      ))}
      <div style={{ textAlign: 'center', padding: '0', width: '100%', maxWidth: '100vw' }}>
        <h1 
          style={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: titleFontSize,
            fontWeight: '700',
            letterSpacing: '-0.02em',
            fontFamily: activeFont.family,
            marginBottom: titleMarginBottom,
            marginTop: 0,
            display: 'inline-flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            textShadow: '0 0 6px rgba(255, 255, 255, 0.4), 0 0 10px rgba(255, 255, 255, 0.2)',
          }}
        >
          <span style={{ display: 'inline-block', position: 'relative' }}>
            {displayText}
            <span 
              style={{ 
                position: 'absolute',
                right: '-0.6em',
                top: '0.23em',
                opacity: showCursor ? 0.9 : 0,
                transition: displayText.length === fullText.length ? 'opacity 0.15s ease-in' : 'none',
                display: 'inline-block',
                width: cursorWidth,
                height: cursorHeight,
                backgroundColor: '#ffffff',
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.4), 0 0 10px rgba(255, 255, 255, 0.2)',
              }}
            />
          </span>
        </h1>
        
        <p 
          style={{ 
            color: 'rgba(255, 255, 255, 0.25)',
            fontSize: subtitleFontSize,
            letterSpacing: '0.05em',
            fontFamily: activeFont.family,
            fontWeight: '700',
            margin: 0,
            marginBottom: subtitleMarginBottom,
            visibility: displayText.length === fullText.length ? 'visible' : 'hidden',
            opacity: displayText.length === fullText.length ? 1 : 0,
            transition: 'opacity 2s ease-in 0.8s',
          }}
        >
          Producer // DJ // Artist
        </p>

        {/* Philosophical text - subtle and hidden */}
        <div
          style={{
            position: 'fixed',
            bottom: philosophicalBottom,
            left: '50%',
            transform: 'translateX(-50%)',
            width: getNavWidth(),
            maxWidth: '775px',
            height: philosophicalHeight,
            textAlign: 'justify',
            fontSize: philosophicalFontSize,
            lineHeight: '1.4',
            color: POKER_RED,
            opacity: philosophicalText.length > 0 ? 1 : 0,
            fontFamily: activeFont.family,
            letterSpacing: '0.20em',
            fontWeight: '400',
            textShadow: '0 0 8px rgba(230, 57, 70, 0.6), 0 0 12px rgba(230, 57, 70, 0.4)',
            pointerEvents: 'none',
            transition: 'width 0.3s ease, height 0.3s ease, font-size 0.3s ease, bottom 0.3s ease',
            overflow: 'hidden',
            visibility: 'visible',
            // Additional Safari-specific scroll prevention
            WebkitOverflowScrolling: 'touch',
            touchAction: 'none',
          }}
        >
          {philosophicalText}
          {showPhilosophicalCursor && (
            <span 
              style={{ 
                opacity: showPhilosophicalCursor ? 1 : 0,
                transition: 'opacity 0.1s',
                position: 'relative',
                top: '-1px',
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
            gap: navGap,
            flexWrap: 'nowrap',
            padding: '0 10px',
            width: getNavWidth(),
            maxWidth: getNavWidth(),
            margin: '0 auto',
          }}
        >
          {navLinks.map((link, index) => {
            const isHovered = hoveredLink === link.page
            const baseDelay = 1.2 // Base delay after typing animation
            const staggerDelay = index * 0.25 // 250ms delay between each button (slower)
            const isVisible = displayText.length === fullText.length
            
            return (
              <button
                key={link.page}
                onClick={(e) => {
                  setHoveredLink(null) // Clear hovered state immediately
                  e.currentTarget.blur() // Remove focus state on mobile
                  onNavigate(link.page)
                }}
                onMouseEnter={() => setHoveredLink(link.page)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  color: isHovered ? POKER_RED : WHITE,
                  fontSize: navFontSize,
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  fontFamily: activeFont.family,
                  textTransform: 'uppercase',
                  transition: `opacity 0.8s ease-out ${baseDelay + staggerDelay}s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${isVisible ? '0s' : baseDelay + staggerDelay + 's'}, color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), padding 0.3s ease`,
                  padding: navPadding,
                  margin: '0',
                  flex: isMobileRange ? '1 1 0' : '0 0 auto',
                  whiteSpace: 'nowrap',
                  visibility: isVisible ? 'visible' : 'hidden',
                  opacity: isVisible ? 1 : 0,
                  transform: (isHovered && !isMobileRange)
                    ? 'scale(1.15)' 
                    : isVisible 
                      ? 'translateY(0) scale(1)' 
                      : 'translateY(0) scale(1)',
                  filter: (isHovered && !isMobileRange) ? 'brightness(1.2)' : 'brightness(1)',
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
