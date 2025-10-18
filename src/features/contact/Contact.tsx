import { socialLinks } from './data'
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

function Contact() {
  const { displayText: subtitleText, showCursor: showSubtitleCursor } = useTypingEffect(
    "// await connect({ booking: true, collaboration: true, press: true })"
  )

  return (
    <PageLayout
      title="CONTACT"
      subtitle={subtitleText + (showSubtitleCursor ? '█' : '')}
    >
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-gray-700 mb-6 text-base sm:text-lg">
            For booking inquiries, press, or general questions, reach out to us:
          </p>
          
          <div className="space-y-3">
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span>{' '}
              <a 
                href="mailto:booking@suite52.com" 
                className="text-blue-600 hover:text-blue-800 transition"
              >
                booking@suite52.com
              </a>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Management:</span>{' '}
              <a 
                href="mailto:management@suite52.com" 
                className="text-blue-600 hover:text-blue-800 transition"
              >
                management@suite52.com
              </a>
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Follow Us
          </h2>
          <div className="flex flex-wrap gap-4">
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  window.getSelection()?.removeAllRanges()
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur()
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium"
              >
                Instagram
              </a>
            )}
            {socialLinks.tiktok && (
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  window.getSelection()?.removeAllRanges()
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur()
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
              >
                TikTok
              </a>
            )}
            {socialLinks.spotify && (
              <a
                href={socialLinks.spotify}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  window.getSelection()?.removeAllRanges()
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur()
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Spotify
              </a>
            )}
            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  window.getSelection()?.removeAllRanges()
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur()
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                YouTube
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">
            💡 <span className="font-semibold">Tip:</span> Update your contact 
            information and social links in{' '}
            <code className="bg-white px-2 py-1 rounded text-xs">
              src/data/social.ts
            </code>
          </p>
        </div>
      </div>
    </PageLayout>
  )
}

export default Contact
