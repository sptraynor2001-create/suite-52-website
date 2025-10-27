import PageLayout from '@/shared/components/layout/PageLayout'
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
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            Suite 52 B2B Henry McBride in NYC with Element
          </h2>
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
        </div>

        {/* UMANO Radio */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
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

        {/* Suite 52 Live at Brooklyn Mirage */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            Suite 52 Live at Brooklyn Mirage
          </h2>
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
        </div>

        {/* Suite 52 Essential Mix for BBC Radio 1 */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            Suite 52 Essential Mix for BBC Radio 1
          </h2>
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
        </div>

        {/* Suite 52 B2B with Tale of Us */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            Suite 52 B2B with Tale of Us
          </h2>
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
        </div>

        {/* Suite 52 Ambient Mix */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            Suite 52 Ambient Mix
          </h2>
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
        </div>

        {/* Suite 52 Warehouse Sessions */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            Suite 52 Warehouse Sessions
          </h2>
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
        </div>

        {/* Suite 52 Fabric London Residency */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            Suite 52 Fabric London Residency
          </h2>
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
        </div>
      </div>
    </PageLayout>
  )
}

export default LiveSets

