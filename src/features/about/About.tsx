import PageLayout from '@/shared/components/layouts/PageLayout'
import { useState, useEffect } from 'react'

// Custom hook for typing effect
function useTypingEffect(text: string, delay: number = 300) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    // Typing animation with expressive timing
    const timings = text.split('').map((char, index) => {
      if (char === ' ') return 150 // Space pause
      if (char === '(' || char === ')') return 100 // Parentheses
      if (char === '[' || char === ']') return 100 // Brackets
      if (char === '{' || char === '}') return 100 // Braces
      if (char === '=') return 120 // Equals
      if (char === '>') return 120 // Greater than
      if (char === '<') return 120 // Less than
      if (char === '.') return 80 // Dot
      if (char === ',') return 150 // Comma pause
      if (char === ';') return 150 // Semicolon pause
      return 60 + Math.random() * 40 // Variable speed for letters
    })

    let currentIndex = 0
    let typingComplete = false

    // Cursor blink
    const cursorInterval = setInterval(() => {
      if (!typingComplete) {
        setShowCursor(prev => !prev)
      }
    }, 530)

    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayText(text.substring(0, currentIndex + 1))
        currentIndex++
        const timingDelay = timings[currentIndex - 1] || 60
        setTimeout(typeNextChar, timingDelay)
      } else {
        // Stop blinking and do quick flashes
        typingComplete = true
        clearInterval(cursorInterval)
        setShowCursor(false)

        // Flash sequence: off-fade on-off-on-off-on-hold-off
        setTimeout(() => {
          setShowCursor(true)
          setTimeout(() => {
            setShowCursor(false)
            setTimeout(() => {
              setShowCursor(true)
              setTimeout(() => {
                setShowCursor(false)
                setTimeout(() => {
                  setShowCursor(true)
                  setTimeout(() => {
                    // Hold for normal duration
                    setTimeout(() => {
                      setShowCursor(false)
                    }, 530)
                  }, 265)
                }, 265)
              }, 265)
            }, 265)
          }, 180)
        }, 400)
      }
    }

    // Start typing after delay
    const startDelay = setTimeout(() => {
      setShowCursor(true)
      typeNextChar()
    }, delay)

    return () => {
      clearTimeout(startDelay)
      clearInterval(cursorInterval)
    }
  }, [text, delay])

  return { displayText, showCursor }
}

function About() {
  const { displayText: subtitleText, showCursor: showSubtitleCursor } = useTypingEffect(
    "// const ARTIST = { name: 'Suite 52', genre: 'Electronic', vibe: 'Immersive' }"
  )

  return (
    <PageLayout
      title="ABOUT"
      subtitle={subtitleText + (showSubtitleCursor ? '█' : '')}
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
