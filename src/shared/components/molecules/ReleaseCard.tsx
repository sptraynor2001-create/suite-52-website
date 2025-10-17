import { Release } from '@/features/music/types'
import { activeFont } from '@/design/fonts'
import { cardStyles, cardColors } from '@/design/cardStyles'

interface ReleaseCardProps {
  release: Release
  onClick?: () => void
}

function ReleaseCard({ release, onClick }: ReleaseCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: cardStyles.margin.gap,
        padding: cardStyles.padding.default,
        ...cardStyles.base,
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: activeFont.family,
        marginBottom: cardStyles.margin.bottom,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = cardStyles.hover.backgroundColor
        e.currentTarget.style.borderColor = cardStyles.hover.borderColor
        e.currentTarget.style.transform = cardStyles.hover.transform
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = cardStyles.base.backgroundColor
        e.currentTarget.style.borderColor = cardColors.border.default
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
            fontSize: '18px',
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
            fontSize: '18px',
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
              fontSize: '14px',
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
              fontSize: '14px',
              fontWeight: '400',
              letterSpacing: '0.02em',
              fontFamily: 'monospace',
              lineHeight: '1.2',
            }}>
              Free Download
            </div>
          )}
        </div>

        {/* Arrow indicator */}
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
      </div>
    </div>
  )
}

export default ReleaseCard

