import PageLayout from '@/shared/components/layout/PageLayout'
import { LiveSetCard, MediaEmbed, LoadingSpinner, ErrorFallback } from '@/shared/components/ui'
import { useTypingEffect } from '@/shared/hooks'
import { useLiveSetsData } from './hooks/useLiveSetsData'

function LiveSets() {
  const { displayText: subtitleText, showCursor: showSubtitleCursor } = useTypingEffect(
    "// RECORDINGS.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)",
    1500
  )

  const { liveSets, loading, error } = useLiveSetsData()

  // For now, we'll render the static content since we don't have API data yet
  // In the future, this would be replaced with dynamic rendering from liveSets

  if (loading) {
    return (
      <PageLayout
        title="LIVE_SETS"
        displayText={subtitleText}
        showCursor={showSubtitleCursor}
        backgroundImage="/images/backgrounds/live-sets-background.jpg"
      >
        <LoadingSpinner size="lg" text="Loading live sets..." />
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout
        title="LIVE_SETS"
        displayText={subtitleText}
        showCursor={showSubtitleCursor}
        backgroundImage="/images/backgrounds/live-sets-background.jpg"
      >
        <ErrorFallback error={error} onRetry={() => window.location.reload()} />
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title="LIVE_SETS"
      displayText={subtitleText}
      showCursor={showSubtitleCursor}
      backgroundImage="/images/backgrounds/live-sets-background.jpg"
    >
      <div className="space-y-12">
        {/* Suite 52 B2B Henry McBride in NYC with Element */}
        <LiveSetCard title="Suite 52 B2B Henry McBride in NYC with Element">
          <MediaEmbed
            type="youtube"
            src="https://www.youtube.com/embed/ziTP36Ixqkk"
            title="Suite 52 B2B Henry McBride in NYC with Element"
          />
        </LiveSetCard>

        {/* UMANO Radio */}
        <LiveSetCard title="UMANO Radio">
          <MediaEmbed
            type="soundcloud"
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/13158665&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
            title="UMANO Radio"
          />
        </LiveSetCard>

        {/* Suite 52 Live at Brooklyn Mirage */}
        <LiveSetCard title="Suite 52 Live at Brooklyn Mirage">
          <MediaEmbed
            type="youtube"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Suite 52 Live at Brooklyn Mirage"
          />
        </LiveSetCard>

        {/* Suite 52 Essential Mix for BBC Radio 1 */}
        <LiveSetCard title="Suite 52 Essential Mix for BBC Radio 1">
          <MediaEmbed
            type="soundcloud"
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/123456789&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
            title="Suite 52 Essential Mix for BBC Radio 1"
          />
        </LiveSetCard>

        {/* Suite 52 B2B with Tale of Us */}
        <LiveSetCard title="Suite 52 B2B with Tale of Us">
          <MediaEmbed
            type="youtube"
            src="https://www.youtube.com/embed/jNQXAC9IVRw"
            title="Suite 52 B2B with Tale of Us"
          />
        </LiveSetCard>

        {/* Suite 52 Ambient Mix */}
        <LiveSetCard title="Suite 52 Ambient Mix">
          <MediaEmbed
            type="soundcloud"
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/987654321&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
            title="Suite 52 Ambient Mix"
          />
        </LiveSetCard>

        {/* Suite 52 Warehouse Sessions */}
        <LiveSetCard title="Suite 52 Warehouse Sessions">
          <MediaEmbed
            type="youtube"
            src="https://www.youtube.com/embed/9bZkp7q19f0"
            title="Suite 52 Warehouse Sessions"
          />
        </LiveSetCard>

        {/* Suite 52 Fabric London Residency */}
        <LiveSetCard title="Suite 52 Fabric London Residency">
          <MediaEmbed
            type="soundcloud"
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/555666777&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
            title="Suite 52 Fabric London Residency"
          />
        </LiveSetCard>
      </div>
    </PageLayout>
  )
}

export default LiveSets

