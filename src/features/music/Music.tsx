/**
 * Music - Releases page with audio-reactive 3D background
 */

import { releases } from './data'
import { useState, useEffect, useMemo } from 'react'
import { activeFont } from '@/themes'
import { cardStyles } from '@/design/cardStyles'

function Music() {
  const [visibleReleases, setVisibleReleases] = useState<number>(0)
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Stagger release reveals
  useEffect(() => {
    let currentIndex = 0
    const showNext = () => {
      if (currentIndex < releases.length) {
        setVisibleReleases(currentIndex + 1)
        currentIndex++
        setTimeout(showNext, 100)
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

  const cardPadding = viewportWidth < 600 ? '16px' : '20px'
  const coverSize = viewportWidth < 600 ? '60px' : '80px'
  const titleFontSize = viewportWidth < 600 ? '15px' : '18px'
  const artistFontSize = viewportWidth < 600 ? '12px' : '14px'

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '120px',
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
            }}
          >
            RELEASES
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: '12px',
              fontFamily: activeFont.family,
              letterSpacing: '0.1em',
              margin: '12px 0 0 0',
            }}
          >
            {'// TRANSMISSIONS.reverse().map(signal => decode(frequency))'}
          </p>
        </div>

        {/* Releases Grid */}
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {releases.slice(0, visibleReleases).map((release, index) => {
            const isHovered = hoveredId === release.id
            
            return (
              <div
                key={release.id}
                style={{
                  ...cardStyles.base,
                  padding: cardPadding,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  opacity: 1,
                  transform: 'translateY(0)',
                  animation: `slideUp 0.5s ease-out ${index * 0.05}s both`,
                  backgroundColor: isHovered ? 'rgba(230, 57, 70, 0.08)' : cardStyles.base.backgroundColor,
                  border: isHovered ? '1px solid rgba(230, 57, 70, 0.4)' : cardStyles.base.border,
                  boxShadow: isHovered ? '0 8px 32px rgba(230, 57, 70, 0.15)' : cardStyles.base.boxShadow,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={() => setHoveredId(release.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Cover Art */}
                <div
                  style={{
                    width: coverSize,
                    height: coverSize,
                    minWidth: coverSize,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {release.coverArt ? (
                    <img
                      src={release.coverArt}
                      alt={release.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255, 255, 255, 0.3)',
                        fontSize: '24px',
                      }}
                    >
                      ♪
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Artists */}
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.4)',
                      fontSize: artistFontSize,
                      fontFamily: 'monospace',
                      letterSpacing: '0.02em',
                      margin: 0,
                      marginBottom: '6px',
                    }}
                  >
                    // {release.artists}
                  </p>

                  {/* Title */}
                  <h3
                    style={{
                      color: isHovered ? '#e63946' : '#ffffff',
                      fontSize: titleFontSize,
                      fontWeight: '700',
                      fontFamily: activeFont.family,
                      margin: 0,
                      marginBottom: '6px',
                      transition: 'color 0.2s ease',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {release.title}
                  </h3>

                  {/* Label */}
                  {release.label && (
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '12px',
                        fontFamily: activeFont.family,
                        letterSpacing: '0.05em',
                        margin: 0,
                      }}
                    >
                      {release.label.toUpperCase()}
                    </p>
                  )}
                </div>

                {/* Arrow indicator */}
                {viewportWidth >= 600 && (
                  <div
                    style={{
                      color: isHovered ? '#e63946' : 'rgba(255, 255, 255, 0.3)',
                      fontSize: '20px',
                      transition: 'color 0.2s ease, transform 0.2s ease',
                      transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                    }}
                  >
                    →
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Empty state */}
        {releases.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(255, 255, 255, 0.3)',
              fontFamily: activeFont.family,
              fontSize: '14px',
            }}
          >
            <p>{'// NO_RELEASES_FOUND'}</p>
            <p style={{ marginTop: '8px', fontSize: '12px', opacity: 0.6 }}>
              return null;
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Footer note */}
      <p
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '900px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.3)',
          fontSize: '12px',
          fontFamily: activeFont.family,
          letterSpacing: '0.1em',
          padding: '0 20px',
          margin: 0,
          opacity: visibleReleases > 0 ? 1 : 0,
          transition: 'opacity 1s ease-out 2s',
        }}
      >
        [ EVERY RELEASE CARRIES A FRAGMENT OF THE TRANSMISSION ]
      </p>
    </div>
  )
}

export default Music
