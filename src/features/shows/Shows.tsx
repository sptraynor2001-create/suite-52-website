import { activeFont } from '@/design/fonts'
import { useState, useEffect } from 'react'

function Shows() {
  const [visibleShows, setVisibleShows] = useState<number>(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const shows = [
    { date: '10-18-25', location: 'New York, US 🇺🇸', event: 'Muzika' },
    { date: '11-01-25', location: 'Brooklyn, US 🇺🇸', event: 'Private' },
    { date: '11-21-25', location: 'Brooklyn, US 🇺🇸', event: 'Unveiled' },
    { date: '12-06-25', location: 'Boston, US 🇺🇸', event: '5ess1ons' },
    { date: '12-11-25', location: 'CDMX, MX 🇲🇽', event: 'Dinsmoor' },
    { date: '12-13-25', location: 'Madrid, ES 🇪🇸', event: 'Houdinni' },
    { date: '12-14-25', location: 'Marbella, ES 🇪🇸', event: 'La Siesta' },
    { date: '12-15-25', location: 'Marbella, ES 🇪🇸', event: 'Momento' },
    { date: '01-12-26', location: 'Barcelona, ES 🇪🇸', event: 'UMANO Barcelona' },
    { date: '01-19-26', location: 'Casablanca, MA 🇲🇦', event: 'Solena' },
    { date: '01-21-26', location: 'Lisbon, PT 🇵🇹', event: 'UMANO x KAYO' },
    { date: '01-30-26', location: 'Dubai, AE 🇦🇪', event: 'Be Beach' },
    { date: '01-31-26', location: 'Beirut, LB 🇱🇧', event: 'Grand Factory' },
  ]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    let currentIndex = 0
    
    const showNext = () => {
      if (currentIndex < shows.length) {
        setVisibleShows(currentIndex + 1)
        currentIndex++
        setTimeout(showNext, 80) // Fast domino effect
      }
    }

    const startDelay = setTimeout(() => {
      showNext()
    }, 300)

    return () => {
      window.removeEventListener('resize', checkMobile)
      clearTimeout(startDelay)
    }
  }, [])

  const POKER_RED = '#e63946'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'calc(100vh - 80px)',
        width: '100%',
        padding: '60px 0',
      }}
    >
      <h2
        style={{
          color: '#ffffff',
          fontSize: '28px',
          fontWeight: '700',
          fontFamily: activeFont.family,
          marginBottom: '50px',
          letterSpacing: '0.1em',
        }}
      >
        UPCOMING_DATES
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 20px',
          boxSizing: 'border-box',
        }}
      >
        {shows.slice(0, visibleShows).map((show, index) => (
            <a
              key={index}
              href="https://bubbl.so"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: hoveredIndex === index ? POKER_RED : 'rgba(255, 255, 255, 0.85)',
                fontSize: isMobile ? '11px' : '16px',
                fontFamily: activeFont.family,
                letterSpacing: '0.08em',
                display: 'flex',
                justifyContent: 'space-between',
                gap: isMobile ? '10px' : '40px',
                padding: isMobile ? '12px 16px' : '16px 20px',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'color 0.15s ease-out',
                animation: 'dropInShow 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
              }}
              onMouseEnter={() => {
                setHoveredIndex(index)
              }}
              onMouseLeave={() => {
                setHoveredIndex(null)
              }}
            >
              <span style={{ flex: '1 1 0', minWidth: '0', textAlign: 'left' }}>{show.date}</span>
              <span style={{ flex: '1 1 0', minWidth: '0', textAlign: 'center' }}>{show.location}</span>
              <span style={{ flex: '1 1 0', minWidth: '0', textAlign: 'right' }}>{show.event}</span>
            </a>
        ))}
      </div>
    </div>
  )
}

export default Shows
