import PageLayout from '@/shared/components/layout/PageLayout'
import { LiveSetCard } from '@/shared/components/ui'
import { useTypingEffect } from '@/shared/hooks/useTypingEffect'

function LiveSets() {
  const { displayText: subtitleText, showCursor: showSubtitleCursor } = useTypingEffect(
    "// RECORDINGS.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)",
    1500
  )

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
          <div className="w-full max-w-2xl mx-auto" style={{ aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/ziTP36Ixqkk"
              title="Suite 52 B2B Henry McBride in NYC with Element"
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </LiveSetCard>

        {/* UMANO Radio */}
        <LiveSetCard title="UMANO Radio">
          <div className="w-full">
            <iframe
              width="100%"
              height="120"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/13158665&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
              title="UMANO Radio"
              className="w-full rounded-lg sm:h-[166px] h-[120px]"
            ></iframe>
          </div>
        </LiveSetCard>

        {/* Suite 52 Live at Brooklyn Mirage */}
        <LiveSetCard title="Suite 52 Live at Brooklyn Mirage">
          <div className="w-full max-w-2xl mx-auto" style={{ aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Suite 52 Live at Brooklyn Mirage"
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </LiveSetCard>

        {/* Suite 52 Essential Mix for BBC Radio 1 */}
        <LiveSetCard title="Suite 52 Essential Mix for BBC Radio 1">
          <div className="w-full">
            <iframe
              width="100%"
              height="120"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/123456789&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
              title="Suite 52 Essential Mix for BBC Radio 1"
              className="w-full rounded-lg sm:h-[166px] h-[120px]"
            ></iframe>
          </div>
        </LiveSetCard>

        {/* Suite 52 B2B with Tale of Us */}
        <LiveSetCard title="Suite 52 B2B with Tale of Us">
          <div className="w-full max-w-2xl mx-auto" style={{ aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/jNQXAC9IVRw"
              title="Suite 52 B2B with Tale of Us"
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </LiveSetCard>

        {/* Suite 52 Ambient Mix */}
        <LiveSetCard title="Suite 52 Ambient Mix">
          <div className="w-full">
            <iframe
              width="100%"
              height="120"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/987654321&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
              title="Suite 52 Ambient Mix"
              className="w-full rounded-lg sm:h-[166px] h-[120px]"
            ></iframe>
          </div>
        </LiveSetCard>

        {/* Suite 52 Warehouse Sessions */}
        <LiveSetCard title="Suite 52 Warehouse Sessions">
          <div className="w-full max-w-2xl mx-auto" style={{ aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/9bZkp7q19f0"
              title="Suite 52 Warehouse Sessions"
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </LiveSetCard>

        {/* Suite 52 Fabric London Residency */}
        <LiveSetCard title="Suite 52 Fabric London Residency">
          <div className="w-full">
            <iframe
              width="100%"
              height="120"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/555666777&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
              title="Suite 52 Fabric London Residency"
              className="w-full rounded-lg sm:h-[166px] h-[120px]"
            ></iframe>
          </div>
        </LiveSetCard>
      </div>
    </PageLayout>
  )
}

export default LiveSets

