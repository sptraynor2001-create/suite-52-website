import { releases } from './data'
import ReleaseCard from '@/shared/components/molecules/ReleaseCard'
import PageLayout from '@/shared/components/layouts/PageLayout'
import { activeFont } from '@/design/fonts'

function Music() {
  return (
    <PageLayout 
      title="RELEASES"
      subtitle="// MUSIC.sort((a, b) => new Date(b.date) - new Date(a.date))"
    >
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
    </PageLayout>
  )
}

export default Music
