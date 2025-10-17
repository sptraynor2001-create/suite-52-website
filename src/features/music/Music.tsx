import { releases } from './data'
import ReleaseCard from '@/shared/components/molecules/ReleaseCard'
import { activeFont } from '@/design/fonts'

function Music() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      padding: '60px 20px',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '40px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '20px',
        }}>
          <h1 style={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: '42px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            fontFamily: activeFont.family,
            margin: 0,
            textShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
          }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{'<'}</span>
            Releases
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{'/>'}</span>
          </h1>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.35)',
            fontSize: '13px',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
            margin: '8px 0 0 0',
          }}>
            // LATEST_TRACKS.sort((a, b) =&gt; new Date(b.date) - new Date(a.date))
          </p>
        </div>

        {/* Release List */}
        <div>
          {releases.map((release) => (
            <ReleaseCard 
              key={release.id} 
              release={release}
              onClick={() => {
                // Add click handler for future functionality (streaming links, etc.)
                console.log('Clicked release:', release.title)
              }}
            />
          ))}
        </div>

        {releases.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'rgba(255, 255, 255, 0.3)',
            fontFamily: activeFont.family,
            fontSize: '14px',
            letterSpacing: '0.05em',
          }}>
            <p>{'// NO_RELEASES_FOUND'}</p>
            <p style={{ marginTop: '8px', fontSize: '12px', opacity: 0.6 }}>
              return null;
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Music
