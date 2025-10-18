import { useState, useEffect } from 'react'

export function useTypingEffect(text: string, delay: number = 300) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    // Typing animation with expressive timing
    const timings = text.split('').map((char) => {
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
        // Show cursor only after first character appears
        if (currentIndex === 0) {
          setShowCursor(true)
        }
        currentIndex++
        // First two characters take longer to type
        let timingDelay = timings[currentIndex - 1] || 60
        if (currentIndex <= 2) {
          timingDelay = timingDelay * 2.5 // Make first two characters 2.5x slower
        }
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
      typeNextChar()
    }, delay)

    return () => {
      clearTimeout(startDelay)
      clearInterval(cursorInterval)
    }
  }, [text, delay])

  return { displayText, showCursor }
}
