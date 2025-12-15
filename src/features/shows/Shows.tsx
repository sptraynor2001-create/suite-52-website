/**
 * Shows - Upcoming events with interactive globe
 */

import { useState, useEffect, useMemo } from 'react'
import { activeFont, backgrounds, breakpoints } from '@/themes'
import { tokens } from '@/design/tokens'
import { animations } from '@/themes/animations'
import { cardStyles } from '@/design/cardStyles'
import { colors } from '@/themes/colors'
import { ShowsScene } from './components/ShowsScene'

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

function Shows() {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)
  const [visibleShows, setVisibleShows] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Stagger show reveals
  useEffect(() => {
    let currentIndex = 0
    const showNext = () => {
      if (currentIndex < shows.length) {
        setVisibleShows(currentIndex + 1)
        currentIndex++
        setTimeout(showNext, 80)
      }
    }

    const startDelay = setTimeout(showNext, 400)
    return () => clearTimeout(startDelay)
  }, [])

  // Responsive sizes
  const titleSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    return `${28 + (42 - 28) * ratio}px`
  }, [viewportWidth])

  const showFontSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    return `${11 + (16 - 11) * ratio}px`
  }, [viewportWidth])

  const showGap = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    return `${8 + (30 - 8) * ratio}px`
  }, [viewportWidth])

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 3D Particle Constellation Globe */}
      <ShowsScene />
      
      {/* Background image */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url(/images/backgrounds/shows-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: backgrounds.shows.position,
          opacity: 0,
          filter: `blur(${backgrounds.shows.blur}) saturate(${backgrounds.shows.saturation})`,
          zIndex: tokens.zIndex.background,
          pointerEvents: 'none',
          animation: `fadeInBackground015 ${animations.page.background.fadeIn} ease-in forwards`,
        }}
      />
      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '90px',
          paddingBottom: '80px',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        {/* Header */}
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto 12px',
            textAlign: 'left',
          }}
        >
          <h1
            style={{
              color: '#ffffff',
              fontSize: titleSize,
              fontWeight: '700',
              letterSpacing: '-0.02em',
              fontFamily: activeFont.family,
              margin: 0,
              textShadow: '0 0 30px rgba(255, 255, 255, 0.2)',
              animation: 'slideIn 0.5s ease-out 0.1s both',
            }}
          >
            UPCOMING_SHOWS
          </h1>
          <p
            style={{
              color: colors.gold.casino,
              fontSize: viewportWidth <= breakpoints.mobile ? '11px' : viewportWidth <= breakpoints.tablet ? '12px' : '12px',
              fontFamily: activeFont.family,
              letterSpacing: '0.1em',
              margin: '6px auto 0',
              animation: 'slideIn 0.5s ease-out 0.2s both',
              backgroundColor: '#000000',
              padding: '4px 8px',
              borderRadius: '4px',
              maxWidth: '800px',
              display: 'block',
            }}
          >
            {'// TIMELINE.query(t => t.status === PENDING && t.coordinates !== NULL)'}
          </p>
        </div>

        {/* Shows List */}
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'auto',
            position: 'relative',
          }}
        >
          {shows.slice(0, visibleShows).map((show, index) => {
            const isHovered = hoveredIndex === index
            
            return (
              <a
                key={index}
                href="https://ra.co"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...cardStyles.base,
                  padding: viewportWidth < 600 ? '14px 16px' : '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: showGap,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: showFontSize,
                  fontFamily: activeFont.family,
                  letterSpacing: '0.08em',
                  opacity: 1,
                  animation: `slideIn 0.5s ease-out ${index * 0.03}s both`,
                  backgroundColor: isHovered ? 'rgba(230, 57, 70, 0.12)' : cardStyles.base.backgroundColor,
                  border: isHovered ? '1px solid rgba(230, 57, 70, 0.5)' : cardStyles.base.border,
                  boxShadow: isHovered 
                    ? '0 4px 20px rgba(230, 57, 70, 0.25), 0 0 40px rgba(230, 57, 70, 0.1)' 
                    : 'none',
                  transform: isHovered ? 'translateX(8px) scale(1.02)' : 'translateX(0) scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glow effect on hover */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at left center, rgba(230, 57, 70, 0.15), transparent 70%)',
                      pointerEvents: 'none',
                      borderRadius: 'inherit',
                      animation: 'pulseGlow 2s ease-in-out infinite',
                    }}
                  />
                )}
                <span 
                  style={{ 
                    flex: '0 0 auto',
                    width: viewportWidth < 600 ? '70px' : '100px',
                    color: isHovered ? '#e63946' : 'rgba(255, 255, 255, 0.6)',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {show.date}
                </span>
                <span 
                  style={{ 
                    flex: 1,
                    textAlign: 'center',
                    fontWeight: '700',
                    color: isHovered ? '#e63946' : 'rgba(255, 255, 255, 0.9)',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {show.event}
                </span>
                <span 
                  style={{ 
                    flex: '0 0 auto',
                    width: viewportWidth < 600 ? '90px' : '140px',
                    textAlign: 'right',
                    color: isHovered ? '#e63946' : 'rgba(255, 255, 255, 0.5)',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {show.location}
                </span>
              </a>
            )
          })}
        </div>

      </div>

      <style>{`
        @keyframes fadeInBackground015 {
          from { opacity: 0; }
          to { opacity: ${backgrounds.shows.opacity}; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default Shows
