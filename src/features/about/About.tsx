import PageLayout from '@/shared/components/layouts/PageLayout'
import { useTypingEffect } from '@/shared/hooks/useTypingEffect'

function About() {
  const { displayText: subtitleText, showCursor: showSubtitleCursor } = useTypingEffect(
    "// const ARTIST = { name: 'Suite 52', genre: 'Electronic', vibe: 'Immersive' }",
    1500
  )

  return (
    <PageLayout
      title="ABOUT"
      displayText={subtitleText}
      showCursor={showSubtitleCursor}
      backgroundImage="/images/backgrounds/about-background.jpg"
    >
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4 text-base sm:text-lg leading-relaxed">
            Welcome to Suite 52. This is where you can share your story, 
            musical journey, and what makes your sound unique.
          </p>
          
          <p className="text-gray-700 mb-4 text-base sm:text-lg leading-relaxed">
            Edit this page in <code className="text-sm bg-gray-100 px-2 py-1 rounded">
            src/pages/About.tsx
            </code> to add your bio, band members, influences, and more.
          </p>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Band Members
            </h2>
            <p className="text-gray-700 text-base sm:text-lg">
              Add information about your band members here...
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Sound
            </h2>
            <p className="text-gray-700 text-base sm:text-lg">
              Describe your musical style and influences...
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default About
