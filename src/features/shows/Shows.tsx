import { activeFont } from '@/design/fonts'
import { useState, useEffect, useMemo } from 'react'
import PageLayout from '@/shared/components/layouts/PageLayout'
import { cardStyles } from '@/design/cardStyles'

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

  // Responsive font size for show rows - scale down more aggressively for mobile
  const showFontSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minSize = 10 // Much smaller on mobile to fit long text
    const maxSize = 16

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const size = minSize + (maxSize - minSize) * ratio

    return `${size}px`
  }, [viewportWidth])

  // Responsive gap for show rows - tighter on mobile
  const showGap = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minGap = 5 // Much tighter on mobile
    const maxGap = 30

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const gap = minGap + (maxGap - minGap) * ratio

    return `${gap}px`
  }, [viewportWidth])

  // Responsive padding for show rows - taller on mobile
  const showPadding = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)

    const vertPadding = 16 - (16 - 12) * ratio // Taller on mobile (16px) to smaller on desktop (12px)
    const horizPadding = 12 + (20 - 12) * ratio

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
                ...cardStyles.base,
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: showFontSize,
                fontFamily: activeFont.family,
                letterSpacing: '0.08em',
                display: 'flex',
                justifyContent: 'space-between',
                gap: showGap,
                padding: showPadding,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                animation: 'dropInShow 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                backgroundColor: hoveredIndex === index ? cardStyles.hover.backgroundColor : cardStyles.base.backgroundColor,
                borderColor: hoveredIndex === index ? cardStyles.hover.borderColor : cardStyles.base.border,
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
