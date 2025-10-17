import { activeFont } from '@/design/fonts'
import { useState, useEffect, useMemo } from 'react'
import PageLayout from '@/shared/components/layouts/PageLayout'

function Shows() {
  const [visibleShows, setVisibleShows] = useState<number>(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)

  const shows = [
    { date: '10_18_25', location: 'NEW_YORK_US', event: 'MUZIKA' },
    { date: '11_01_25', location: 'BROOKLYN_US', event: 'PRIVATE' },
    { date: '11_21_25', location: 'BROOKLYN_US', event: 'UNVEILED' },
    { date: '12_06_25', location: 'BOSTON_US', event: '5ESS1ONS' },
    { date: '12_11_25', location: 'CDMX', event: 'DINSMOOR' },
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
    const updateViewport = () => {
      setViewportWidth(window.innerWidth)
    }
    
    updateViewport()
    window.addEventListener('resize', updateViewport)

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
      window.removeEventListener('resize', updateViewport)
      clearTimeout(startDelay)
    }
  }, [])

  const POKER_RED = '#e63946'

  // Responsive font size for show rows - larger minimum for mobile
  const showFontSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minSize = 13 // Larger minimum for mobile (was 11px)
    const maxSize = 16
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const size = minSize + (maxSize - minSize) * ratio
    
    return `${size}px`
  }, [viewportWidth])

  // Responsive gap for show rows
  const showGap = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minGap = 10
    const maxGap = 40
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const gap = minGap + (maxGap - minGap) * ratio
    
    return `${gap}px`
  }, [viewportWidth])

  // Responsive padding for show rows
  const showPadding = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    
    const vertPadding = 12 + (16 - 12) * ratio
    const horizPadding = 16 + (20 - 16) * ratio
    
    return `${vertPadding}px ${horizPadding}px`
  }, [viewportWidth])

  return (
    <PageLayout 
      title="UPCOMING_SHOWS"
      subtitle="// EVENTS.filter(e => new Date(e.date) >= Date.now()).map(show => show)"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {shows.slice(0, visibleShows).map((show, index) => (
            <a
              key={index}
              href="https://bubbl.so"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // Clear any text selection and blur active element
                window.getSelection()?.removeAllRanges()
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur()
                }
              }}
              style={{
                color: hoveredIndex === index ? POKER_RED : 'rgba(255, 255, 255, 0.85)',
                fontSize: showFontSize,
                fontFamily: activeFont.family,
                letterSpacing: '0.08em',
                display: 'flex',
                justifyContent: 'space-between',
                gap: showGap,
                padding: showPadding,
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
    </PageLayout>
  )
}

export default Shows
