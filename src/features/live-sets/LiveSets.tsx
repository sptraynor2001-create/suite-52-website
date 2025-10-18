import { liveSets } from './data'
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

function LiveSets() {
  const { displayText: subtitleText, showCursor: showSubtitleCursor } = useTypingEffect(
    "// RECORDINGS.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)"
  )
  // Sort live sets by date (most recent first)
  const sortedSets = [...liveSets].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <PageLayout
      title="LIVE_SETS"
      subtitle={subtitleText + (showSubtitleCursor ? '█' : '')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedSets.map((set) => (
          <div 
            key={set.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            {set.thumbnail && (
              <div className="relative aspect-video bg-gray-200">
                <img 
                  src={set.thumbnail} 
                  alt={set.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x450?text=Live+Set'
                  }}
                />
                {set.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    {set.duration}
                  </div>
                )}
              </div>
            )}
            
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {set.title}
              </h2>
              
              <div className="space-y-1 mb-4">
                <p className="text-gray-600 text-sm sm:text-base">
                  {formatDate(set.date)}
                </p>
                {(set.venue || set.city) && (
                  <p className="text-gray-600 text-sm sm:text-base">
                    {set.venue && <span>{set.venue}</span>}
                    {set.venue && set.city && <span> • </span>}
                    {set.city && <span>{set.city}</span>}
                  </p>
                )}
              </div>

              {set.description && (
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                  {set.description}
                </p>
              )}

              {set.setlist && set.setlist.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Setlist:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {set.setlist.map((track, index) => (
                      <li key={index}>
                        {index + 1}. {track}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {set.youtubeUrl && (
                  <a
                    href={set.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      window.getSelection()?.removeAllRanges()
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur()
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube
                  </a>
                )}
                {set.soundcloudUrl && (
                  <a
                    href={set.soundcloudUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      window.getSelection()?.removeAllRanges()
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur()
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition"
                  >
                    SoundCloud
                  </a>
                )}
                {set.mixcloudUrl && (
                  <a
                    href={set.mixcloudUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      window.getSelection()?.removeAllRanges()
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur()
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
                  >
                    Mixcloud
                  </a>
                )}
                {set.spotifyUrl && (
                  <a
                    href={set.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      window.getSelection()?.removeAllRanges()
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur()
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
                  >
                    Spotify
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {liveSets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No live sets available yet. Check back soon!
          </p>
        </div>
      )}
    </PageLayout>
  )
}

export default LiveSets

