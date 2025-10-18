import PageLayout from '@/shared/components/layouts/PageLayout'
import { useTypingEffect } from '@/shared/hooks/useTypingEffect'

function LiveSets() {
  const { displayText: subtitleText, showCursor: showSubtitleCursor } = useTypingEffect(
    "// RECORDINGS.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)"
  )

  return (
    <PageLayout
      title="LIVE_SETS"
      displayText={subtitleText}
      showCursor={showSubtitleCursor}
      backgroundImage="/images/backgrounds/live-sets-background.jpg"
    >
      <div className="space-y-12">
        {/* YouTube Embed */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            Suite 52 B2B Henry McBride in NYC with Element
          </h2>
          <div className="aspect-video w-full max-h-[250px] sm:max-h-[400px]">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Suite 52 B2B Henry McBride in NYC with Element"
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* SoundCloud Embed */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            UMANO Radio
          </h2>
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
        </div>
      </div>
    </PageLayout>
  )
}

export default LiveSets

