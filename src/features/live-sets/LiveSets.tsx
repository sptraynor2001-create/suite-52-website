/**
 * LiveSets - Recorded sets with 3D portal backgrounds
 */

import { useState, useEffect, useMemo } from 'react'
import { activeFont, backgrounds, breakpoints } from '@/themes'
import { tokens } from '@/design/tokens'
import { animations } from '@/themes/animations'
import { cardStyles } from '@/design/cardStyles'
import { LiveSetsScene } from './components/LiveSetsScene'

const liveSets = [
  {
    id: '1',
    title: 'Suite 52 b2b Henry McBride in NYC [10.04.25]',
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/M3y5BRFdOa8',
  },
]

function LiveSets() {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)
  const [hoveredSetId, setHoveredSetId] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const titleSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    return `${28 + (42 - 28) * ratio}px`
  }, [viewportWidth])

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 3D Background Scene */}
      <LiveSetsScene liveSets={liveSets} hoveredSetId={hoveredSetId} />
      
      {/* Background image */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url(/images/backgrounds/live-sets-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: backgrounds.liveSets.position,
          opacity: 0,
          filter: `blur(${backgrounds.liveSets.blur}) saturate(${backgrounds.liveSets.saturation})`,
          zIndex: tokens.zIndex.background,
          pointerEvents: 'none',
          animation: `fadeInBackground008 ${animations.page.background.fadeIn} ease-in forwards`,
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
              animation: 'slideUp 0.6s ease-out 0.1s both',
            }}
          >
            LIVE_SETS
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: viewportWidth <= breakpoints.mobile ? '11px' : viewportWidth <= breakpoints.tablet ? '12px' : '12px',
              fontFamily: activeFont.family,
              letterSpacing: '0.1em',
              margin: '12px 0 0 0',
              animation: 'slideUp 0.6s ease-out 0.2s both',
            }}
          >
            {'// ARCHIVE.stream(moment => moment.captured && moment.raw)'}
          </p>
        </div>

        {/* Sets Grid */}
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          {liveSets.map((set, index) => {
            const isHovered = hoveredSetId === set.id
            
            return (
            <div
              key={set.id}
              style={{
                ...cardStyles.base,
                padding: '24px',
                opacity: 1,
                animation: `fadeUp 0.6s ease-out ${index * 0.1}s both`,
                backgroundColor: isHovered ? 'rgba(230, 57, 70, 0.08)' : cardStyles.base.backgroundColor,
                border: isHovered ? '1px solid rgba(230, 57, 70, 0.4)' : cardStyles.base.border,
                boxShadow: isHovered ? '0 8px 32px rgba(230, 57, 70, 0.15)' : 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={() => setHoveredSetId(set.id)}
              onMouseLeave={() => setHoveredSetId(null)}
            >
              {/* Title */}
              <h3
                style={{
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '700',
                  fontFamily: activeFont.family,
                  margin: '0 0 16px 0',
                  letterSpacing: '0.02em',
                }}
              >
                {set.title}
              </h3>

              {/* Embed */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }}
              >
                {set.type === 'youtube' ? (
                  <div style={{ aspectRatio: '16/9' }}>
                    <iframe
                      width="100%"
                      height="100%"
                      src={set.embedUrl}
                      title={set.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ display: 'block' }}
                    />
                  </div>
                ) : (
                  <iframe
                    width="100%"
                    height={viewportWidth < 600 ? '120' : '166'}
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src={set.embedUrl}
                    title={set.title}
                    style={{ display: 'block' }}
                  />
                )}

                {/* Portal glow overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    boxShadow: 'inset 0 0 30px rgba(230, 57, 70, 0.1)',
                    borderRadius: '8px',
                  }}
                />
              </div>
            </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeInBackground008 {
          from { opacity: 0; }
          to { opacity: ${backgrounds.liveSets.opacity}; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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
          maxWidth: '800px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.3)',
          fontSize: viewportWidth <= 768 ? '9px' : '12px',
          fontFamily: activeFont.family,
          letterSpacing: '0.1em',
          padding: '0 20px',
          margin: 0,
          animation: 'fadeIn 1s ease-out 2s both',
        }}
      >
        [ MOMENTS CAPTURED IN THE SPACE BETWEEN BEATS ]
      </p>
    </div>
  )
}

export default LiveSets
