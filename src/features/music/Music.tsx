import { releases } from './data'
import ReleaseCard from '@/shared/components/molecules/ReleaseCard'
import PageLayout from '@/shared/components/layouts/PageLayout'
import { activeFont } from '@/design/fonts'
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

function Music() {
  const [visibleReleases, setVisibleReleases] = useState<number>(0)
  const { displayText: subtitleText, showCursor: showSubtitleCursor } = useTypingEffect(
    "// MUSIC.sort((a, b) => new Date(b.date) - new Date(a.date))"
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
      subtitle={subtitleText + (showSubtitleCursor ? '█' : '')}
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
