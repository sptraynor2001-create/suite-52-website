import { releases } from './data'
import ReleaseCard from '@/shared/components/ui/ReleaseCard'
import PageLayout from '@/shared/components/layout/PageLayout'
import { activeFont } from '@/design/fonts'
import { useTypingEffect } from '@/shared/hooks/useTypingEffect'
import { useState, useEffect } from 'react'

function Music() {
  const [visibleReleases, setVisibleReleases] = useState<number>(0)
  const { displayText: subtitleText, showCursor: showSubtitleCursor } = useTypingEffect(
    "// MUSIC.sort((a, b) => new Date(b.date) - new Date(a.date))",
    1500
  )

  useEffect(() => {
    let currentIndex = 0

    const showNext = () => {
      if (currentIndex < releases.length) {
        setVisibleReleases(currentIndex + 1)
        currentIndex++
        setTimeout(showNext, 80) // Fast domino effect
      }
    }

    const startDelay = setTimeout(() => {
      showNext()
    }, 300)

    return () => {
      clearTimeout(startDelay)
    }
  }, [])

  return (
    <PageLayout
      title="RELEASES"
      displayText={subtitleText}
      showCursor={showSubtitleCursor}
      backgroundImage="/images/backgrounds/music-background.jpg"
    >
      {releases.slice(0, visibleReleases).map((release, index) => (
        <ReleaseCard
          key={release.id}
          release={release}
          index={index}
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
