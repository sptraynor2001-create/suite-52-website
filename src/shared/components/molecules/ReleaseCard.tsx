import { Release } from '@/features/music/types'
import { activeFont } from '@/design/fonts'

interface ReleaseCardProps {
  release: Release
  onClick?: () => void
}

function ReleaseCard({ release, onClick }: ReleaseCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: '2-digit' 
    })
  }

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        fontFamily: activeFont.family,
        marginBottom: '12px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
        e.currentTarget.style.transform = 'translateX(4px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
        e.currentTarget.style.transform = 'translateX(0)'
      }}
    >
      {/* Left section - Main info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'baseline',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: '17px',
            fontWeight: '700',
            letterSpacing: '0.01em',
          }}>
            {release.title}
          </span>
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: '14px',
            fontWeight: '400',
          }}>
            //
          </span>
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '14px',
            fontWeight: '500',
          }}>
            {release.artists}
          </span>
        </div>
        
        {release.label && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ 
              color: 'rgba(230, 57, 70, 0.8)',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '2px 8px',
              backgroundColor: 'rgba(230, 57, 70, 0.1)',
              border: '1px solid rgba(230, 57, 70, 0.3)',
              borderRadius: '2px',
            }}>
              [{release.label}]
            </span>
          </div>
        )}
      </div>

      {/* Right section - Date */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ 
          color: 'rgba(255, 255, 255, 0.35)',
          fontSize: '13px',
          fontWeight: '500',
          fontFamily: 'monospace',
          letterSpacing: '0.02em',
        }}>
          ({formatDate(release.releaseDate)})
        </span>
        
        {/* Arrow indicator */}
        <span style={{ 
          color: 'rgba(255, 255, 255, 0.3)',
          fontSize: '16px',
          transition: 'transform 0.2s ease',
        }}>
          →
        </span>
      </div>
    </div>
  )
}

export default ReleaseCard

