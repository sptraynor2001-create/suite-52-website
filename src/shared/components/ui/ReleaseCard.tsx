import { Release } from '@/features/music/types'
import { activeFont, componentColors } from '@/themes'
import { useState, useEffect, useMemo } from 'react'

interface ReleaseCardProps {
  release: Release
  index?: number
  onClick?: () => void
}

function ReleaseCard({ release, index = 0, onClick }: ReleaseCardProps) {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Responsive font sizes - scale down as screen gets smaller
  const labelFontSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minSize = 11 // Smaller on mobile
    const maxSize = 14

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const size = minSize + (maxSize - minSize) * ratio

    return `${size}px`
  }, [viewportWidth])

  const titleFontSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minSize = 12 // Even more scaling on mobile
    const maxSize = 18

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const size = minSize + (maxSize - minSize) * ratio

    return `${size}px`
  }, [viewportWidth])

  const commentFontSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minSize = 12 // 12px on mobile as requested
    const maxSize = 18

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const size = minSize + (maxSize - minSize) * ratio

    return `${size}px`
  }, [viewportWidth])

  // Hide arrow on mobile
  const showArrow = viewportWidth >= 768

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        backgroundColor: componentColors.card.background,
        borderRadius: '12px',
        border: `1px solid ${componentColors.card.border}`,
        boxShadow: componentColors.card.shadow,
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: activeFont.family,
        marginBottom: '16px',
        animation: 'dropInShow 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
        e.currentTarget.style.transform = 'translateX(4px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = componentColors.card.background
        e.currentTarget.style.borderColor = componentColors.card.border
        e.currentTarget.style.transform = 'translateX(0)'
      }}
    >
      {/* Cover Art */}
      <div style={{
        width: '64px',
        height: '64px',
        minWidth: '64px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {release.coverArt ? (
          <img 
            src={release.coverArt} 
            alt={release.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <span style={{
            color: 'rgba(255, 255, 255, 0.2)',
            fontSize: '24px',
            fontWeight: '300',
          }}>
            ♪
          </span>
        )}
      </div>

      {/* Track Info Section */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        {/* Left section - Main info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
          {/* Row 1: Artists */}
          <div style={{
            color: 'rgba(255, 255, 255, 0.35)',
            fontSize: commentFontSize,
            fontWeight: '500',
            letterSpacing: '0.02em',
            fontFamily: 'monospace',
            lineHeight: '1.2',
          }}>
            // {release.artists}
          </div>
          
          {/* Row 2: Song title */}
          <div style={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: titleFontSize,
            fontWeight: '700',
            letterSpacing: '0.02em',
            fontFamily: 'monospace',
            lineHeight: '1.2',
          }}>
            {release.title}
          </div>

          {/* Row 3: Label or Free Download */}
          {release.label ? (
            <div style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: labelFontSize,
              fontWeight: '400',
              letterSpacing: '0.02em',
              fontFamily: 'monospace',
              lineHeight: '1.2',
            }}>
              {release.label}
            </div>
          ) : release.title === "Fallin' (Gabe Rich & Suite 52 Remix)" && (
            <div style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: labelFontSize,
              fontWeight: '400',
              letterSpacing: '0.02em',
              fontFamily: 'monospace',
              lineHeight: '1.2',
            }}>
              Free Download
            </div>
          )}
        </div>

        {/* Arrow indicator - hidden on mobile */}
        {showArrow && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <span style={{
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: '24px',
              transition: 'transform 0.2s ease',
            }}>
              →
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReleaseCard

