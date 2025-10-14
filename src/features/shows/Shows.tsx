import { activeFont } from '@/design/fonts'
import { useState, useEffect } from 'react'

function Shows() {
  const [visibleShows, setVisibleShows] = useState<number>(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const shows = [
    { date: '10_18_25', location: 'NEW_YORK_US', event: 'MUZIKA' },
    { date: '11_01_25', location: 'BROOKLYN_US', event: 'PRIVATE' },
    { date: '11_21_25', location: 'BROOKLYN_US', event: 'UNVEILED' },
    { date: '12_06_25', location: 'BOSTON_US', event: '5ESS1ONS' },
    { date: '12_11_25', location: 'CDMX_MX', event: 'DINSMOOR' },
    { date: '12_13_25', location: 'MADRID_ES', event: 'HOUDINNI' },
    { date: '12_14_25', location: 'MARBELLA_ES', event: 'LA_SIESTA' },
    { date: '12_15_25', location: 'MARBELLA_ES', event: 'MOMENTO' },
    { date: '01_12_26', location: 'BARCELONA_ES', event: 'UMANO_BARCELONA' },
    { date: '01_19_26', location: 'CASABLANCA_MA', event: 'SOLENA' },
    { date: '01_21_26', location: 'LISBON_PT', event: 'UMANO_X_KAYO' },
    { date: '01_30_26', location: 'DUBAI_AE', event: 'BE_BEACH' },
    { date: '01_31_26', location: 'BEIRUT_LB', event: 'GRAND_FACTORY' },
  ]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight < 768)
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
                transition: 'color 0.15s ease-out, transform 0.2s ease-out, background-color 0.2s ease-out',
                animation: 'dropInShow 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                backgroundColor: hoveredIndex === index ? 'rgba(230, 57, 70, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={() => {
                setHoveredIndex(index)
              }}
              onMouseLeave={() => {
                setHoveredIndex(null)
              }}
            >
              <span style={{ flex: '1 1 0', minWidth: '0', textAlign: 'left' }}>{show.date}</span>
              <span style={{ flex: '1 1 0', minWidth: '0', textAlign: 'center' }}>{show.event}</span>
              <span style={{ flex: '1 1 0', minWidth: '0', textAlign: 'right' }}>{show.location}</span>
            </a>
        ))}
      </div>
    </div>
  )
}

export default Shows
