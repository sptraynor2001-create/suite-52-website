import { useEffect, useState } from 'react'
import { activeFont } from '@/design/fonts'

function Home() {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
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

  return (
    <div 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
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
            marginBottom: '8px',
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
            opacity: displayText.length === fullText.length ? 1 : 0,
            transition: 'opacity 0.8s ease-in 0.8s',
          }}
        >
          Producer // DJ // Artist
        </p>
      </div>
    </div>
  )
}

export default Home
