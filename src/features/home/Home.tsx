/**
 * Home - Entry Experience
 * Elegant landing with motion-blurred background and swirling particles
 */

import { useEffect, useState, useCallback } from 'react'
import { activeFont } from '@/themes'
import { PortalScene } from './components'

type Page = 'home' | 'about' | 'music' | 'live-sets' | 'shows' | 'contact'

interface HomeProps {
  onNavigate: (page: Page) => void
}

function Home({ onNavigate }: HomeProps) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)
  const [philosophicalText, setPhilosophicalText] = useState('')
  const [showPhilosophicalCursor, setShowPhilosophicalCursor] = useState(false)
  const [isPhilosophicalTyping, setIsPhilosophicalTyping] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [roleIndex, setRoleIndex] = useState(0)
  const [jumbledText, setJumbledText] = useState('')
  const [showJumbled, setShowJumbled] = useState(false)

  const fullText = 'Suite 52'
  const fullPhilosophicalText = 'PATTERNS MANIFEST IN MUSIC THROUGH RHYTHM AND MEASURE. IN MATHEMATICS THROUGH EQUATIONS. IN NATURE THROUGH PHYSICAL LAWS. BUT MOST PROFOUNDLY IN THE ARCHITECTURE OF HUMAN EXPERIENCE. THE WORK IS TRANSLATING THESE EMOTIONAL PATTERNS INTO FREQUENCIES THAT RESONATE. INTO RHYTHMS THAT CONNECT. INTO MOMENTS WHERE A ROOM FULL OF INDIVIDUALS BECOMES SOMETHING MORE.'
  
  // Rotating individual roles
  const roles = [
    'ARTIST',
    'MUSIC PRODUCER',
    'DJ',
    'ENGINEER',
    'DESIGNER',
  ]

  // Colors
  const ACCENT = 'rgba(230, 57, 70, 0.8)'
  const WHITE = '#ffffff'

  // Track mouse for parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight < 768)
      setViewportWidth(window.innerWidth)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    setIsReady(true)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Typing animation for title
  useEffect(() => {
    const timings = [220, 120, 130, 100, 160, 300, 150, 125]
    let currentIndex = 0
    let typingComplete = false
    
    const cursorInterval = setInterval(() => {
      if (!typingComplete) {
        setShowCursor(prev => !prev)
      }
    }, 530)
    
    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex + 1))
        currentIndex++
        const delay = timings[currentIndex - 1] || 100
        setTimeout(typeNextChar, delay)
      } else {
        typingComplete = true
        clearInterval(cursorInterval)
        setShowCursor(false)
        setTimeout(() => {
          setShowCursor(true)
          setTimeout(() => {
            setShowCursor(false)
            setTimeout(() => {
              setShowCursor(true)
              setTimeout(() => {
                setShowCursor(false)
              }, 530)
            }, 265)
          }, 265)
        }, 400)
      }
    }

    const startDelay = setTimeout(() => {
      setShowCursor(true)
      typeNextChar()
    }, 800)

    return () => {
      clearTimeout(startDelay)
      clearInterval(cursorInterval)
    }
  }, [])

  // Philosophical text typing
  useEffect(() => {
    const startDelay = setTimeout(() => {
      setIsPhilosophicalTyping(true)
      setShowPhilosophicalCursor(true)
      let currentIndex = 0
      
      const typeNextChar = () => {
        if (currentIndex < fullPhilosophicalText.length) {
          setPhilosophicalText(fullPhilosophicalText.substring(0, currentIndex + 1))
          currentIndex++
          const delay = 30 + Math.random() * 50
          setTimeout(typeNextChar, delay)
        } else {
          setIsPhilosophicalTyping(false)
          setTimeout(() => setShowPhilosophicalCursor(false), 1000)
        }
      }
      
      typeNextChar()
    }, 3500)

    return () => clearTimeout(startDelay)
  }, [])

  // Cursor blink for philosophical text
  useEffect(() => {
    if (isPhilosophicalTyping) {
      setShowPhilosophicalCursor(true)
      return
    }
    
    if (philosophicalText.length === fullPhilosophicalText.length && philosophicalText.length > 0) {
      const cursorInterval = setInterval(() => {
        setShowPhilosophicalCursor(prev => !prev)
      }, 530)
      return () => clearInterval(cursorInterval)
    }
  }, [isPhilosophicalTyping, philosophicalText])

  // Rotate through roles animation with intelligent transformation
  useEffect(() => {
    // Start rotation after title is complete
    if (displayText.length !== fullText.length) return

    let interval: NodeJS.Timeout | null = null
    let transitionInterval: NodeJS.Timeout | null = null

    const startDelay = setTimeout(() => {
      const scheduleNextTransition = () => {
        const currentPrevIndex = roleIndex
        const nextIndex = (roleIndex + 1) % roles.length
        const oldText = roles[currentPrevIndex]
        const newText = roles[nextIndex]
        
        setShowJumbled(true)
        
        // Intelligently transform text step by step with random timing
        let progress = 0
        // Use more steps for transitions with larger character differences
        // ARTIST (6 chars) -> MUSIC PRODUCER (14 chars) = 8 char difference
        // DJ (2 chars) -> ENGINEER (8 chars) = 6 char difference
        const isLongTransition = 
          (currentPrevIndex === 0 && nextIndex === 1) || // ARTIST -> MUSIC PRODUCER
          (currentPrevIndex === 2 && nextIndex === 3)    // DJ -> ENGINEER
        const steps = isLongTransition 
          ? 40 + Math.floor(Math.random() * 20) // 40-60 steps for long transitions
          : 20 + Math.floor(Math.random() * 10) // 20-30 steps for normal transitions
        let stepIndex = 0
        
        const doStep = () => {
          if (stepIndex >= steps) {
            // Set final text
            setRoleIndex(nextIndex)
            setShowJumbled(false)
            setJumbledText('')
            
            // Schedule next transition with random delay
            const nextDelay = 2000 + Math.random() * 1500 // 2-3.5 seconds
            interval = setTimeout(scheduleNextTransition, nextDelay)
            return
          }
          
          progress = stepIndex / steps
          setJumbledText(generateTransitionText(oldText, newText, progress))
          stepIndex++
          
          // Random step duration: 35-55ms for variation
          const stepDuration = 35 + Math.random() * 20
          transitionInterval = setTimeout(doStep, stepDuration)
        }
        
        doStep()
      }
      
      // Start first transition
      scheduleNextTransition()
    }, 2800) // Start 2.8 seconds after title completes

    return () => {
      clearTimeout(startDelay)
      if (interval) clearTimeout(interval)
      if (transitionInterval) clearTimeout(transitionInterval)
    }
  }, [displayText.length, fullText.length, roles.length, roleIndex])

  // Responsive width calculation
  const getContentWidth = () => {
    const minWidth = 375
    const maxWidth = 1920
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const percent = 95 + (45 - 95) * ratio
    return `${percent}%`
  }

  // Intelligently transform text from old to new, step by step
  const generateTransitionText = (oldText: string, newText: string, progress: number): string => {
    // progress is 0 to 1, where 0 = oldText, 1 = newText
    const oldLength = oldText.length
    const newLength = newText.length
    let result = ''
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    
    // Calculate target length - characters are added/removed during middle of animation (0.3-0.7)
    let targetLength = oldLength
    if (progress < 0.3) {
      // Early: keep old length
      targetLength = oldLength
    } else if (progress < 0.7) {
      // Middle: gradually transition length
      const midProgress = (progress - 0.3) / 0.4 // 0 to 1 within middle section
      const lengthDiff = newLength - oldLength
      targetLength = oldLength + Math.round(lengthDiff * midProgress)
    } else {
      // Late: use new length
      targetLength = newLength
    }
    
    // Calculate character transformation progress (for individual character changes)
    // Characters transform more gradually, starting earlier
    const charTransformStart = 0.2
    const charTransformEnd = 0.9
    const charProgress = progress < charTransformStart 
      ? 0 
      : progress > charTransformEnd 
        ? 1 
        : (progress - charTransformStart) / (charTransformEnd - charTransformStart)
    
    for (let i = 0; i < targetLength; i++) {
      const oldChar = i < oldLength ? oldText[i] : null
      const newChar = i < newLength ? newText[i] : null
      
      // Determine if this character position should be transformed
      const shouldTransform = i < Math.floor(charProgress * targetLength)
      
      if (oldChar === newChar && oldChar !== null) {
        // Characters match - keep them (unless we're past this point in transformation)
        if (shouldTransform && Math.random() < 0.2) {
          // Occasionally glitch even matching chars during transition
          result += chars[Math.floor(Math.random() * chars.length)]
        } else {
          result += oldChar
        }
      } else {
        // Characters differ or one doesn't exist
        if (!shouldTransform) {
          // Not transformed yet - show old char or random glitch for new positions
          if (oldChar) {
            result += oldChar
          } else {
            // New character position that doesn't exist in old text
            // Show glitchy random characters until it's time to reveal
            result += chars[Math.floor(Math.random() * chars.length)]
          }
        } else {
          // Being transformed - gradually move toward new char
          if (charProgress < 0.4) {
            // Early: mostly old/random with some glitches
            if (oldChar && Math.random() < 0.7) {
              result += oldChar
            } else {
              result += chars[Math.floor(Math.random() * chars.length)]
            }
          } else if (charProgress < 0.8) {
            // Middle: mix of old, new, and transition chars
            const rand = Math.random()
            if (rand < 0.25 && oldChar) {
              result += oldChar
            } else if (rand < 0.65 && newChar) {
              result += newChar
            } else {
              // Transition character
              result += chars[Math.floor(Math.random() * chars.length)]
            }
          } else {
            // Late: mostly new with occasional glitches
            if (newChar && Math.random() < 0.85) {
              result += newChar
            } else {
              result += chars[Math.floor(Math.random() * chars.length)]
            }
          }
        }
      }
    }
    
    return result
  }

  const handleEnter = useCallback(() => {
    onNavigate('about')
  }, [onNavigate])

  if (!isReady) return null

  return (
    <div 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        background: '#000',
        cursor: 'pointer',
      }}
      onClick={handleEnter}
    >
      {/* Background Photo with motion blur effect */}
      <div
        style={{
          position: 'fixed',
          top: '-5%',
          left: '-5%',
          width: '110%',
          height: '110%',
          zIndex: 0,
          backgroundImage: 'url(/images/backgrounds/home-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          filter: 'blur(2px) saturate(0.5)',
          transform: 'scale(1.05)',
          animation: 'subtleFloat 25s ease-in-out infinite',
        }}
      />

      {/* Secondary layer for motion blur depth */}
      <div
        style={{
          position: 'fixed',
          top: '-5%',
          left: '-5%',
          width: '110%',
          height: '110%',
          zIndex: 1,
          backgroundImage: 'url(/images/backgrounds/home-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          filter: 'blur(6px) saturate(0.3)',
          transform: 'scale(1.1)',
          animation: 'subtleFloat 30s ease-in-out infinite reverse',
        }}
      />

      {/* Swirling particles */}
      <PortalScene 
        mouseX={mousePosition.x}
        mouseY={mousePosition.y}
      />

      {/* Dark vignette overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 3,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.85) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle grain texture */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 4,
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        }}
      />

      {/* UI Content */}
      <div 
        style={{ 
          position: 'relative',
          zIndex: 10,
          textAlign: 'center', 
          padding: '0', 
          width: '100%', 
          maxWidth: '100vw',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Main text group wrapper */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        {/* Title */}
        <h1 
          style={{ 
            color: 'rgba(255, 255, 255, 0.92)',
            fontSize: isMobile ? '48px' : '72px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            fontFamily: activeFont.family,
            marginBottom: '4px',
            marginTop: 0,
            display: 'inline-flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            textShadow: '0 4px 60px rgba(0, 0, 0, 0.8)',
          }}
        >
          <span style={{ display: 'inline-block', position: 'relative' }}>
            {displayText}
            <span 
              style={{ 
                position: 'absolute',
                right: '-0.45em',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: showCursor ? 1 : 0,
                transition: displayText.length === fullText.length ? 'opacity 0.15s ease-in' : 'none',
                display: 'inline-block',
                width: isMobile ? '18px' : '24px',
                height: isMobile ? '34px' : '46px',
                backgroundColor: WHITE,
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
              }}
            />
          </span>
        </h1>
        
        {/* Subtitle */}
        <div
          style={{
            height: isMobile ? '28px' : '36px',
            width: '100%',
            marginBottom: '12px',
            overflow: 'hidden',
            visibility: displayText.length === fullText.length ? 'visible' : 'hidden',
            opacity: displayText.length === fullText.length ? 1 : 0,
            transition: displayText.length === fullText.length ? 'opacity 2s ease-in 0.8s' : 'none',
            perspective: '1000px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Text that transforms intelligently */}
            <div
              key={`role-${roleIndex}-${showJumbled ? 'transition' : 'stable'}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                transform: 'translateX(-50%)',
                color: 'rgba(255, 255, 255, 0.35)',
                fontSize: isMobile ? '16px' : '20px',
                letterSpacing: '0.3em',
                fontFamily: activeFont.family,
                fontWeight: '300',
                margin: 0,
                whiteSpace: 'nowrap',
                opacity: 1,
              }}
            >
              {showJumbled && jumbledText ? jumbledText : roles[roleIndex]}
            </div>
          </div>
        </div>

        {/* Click to Enter */}
        <p 
          style={{
            color: '#e63946',
            fontSize: isMobile ? '14px' : '18px',
            letterSpacing: '0.25em',
            fontFamily: activeFont.family,
            fontWeight: '900',
            margin: 0,
            visibility: displayText.length === fullText.length ? 'visible' : 'hidden',
            opacity: displayText.length === fullText.length ? 1 : 0,
            transform: displayText.length === fullText.length ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 1s ease-in 1.5s, transform 1s ease-in 1.5s',
            animation: displayText.length === fullText.length ? 'glitchyGlow 3s ease-in-out forwards, subtlePulse 4s ease-in-out 3s infinite' : 'none',
            pointerEvents: 'auto',
            cursor: 'pointer',
            textShadow: `
              0 0 10px rgba(230, 57, 70, 0.8),
              0 0 20px rgba(230, 57, 70, 0.6),
              0 0 30px rgba(230, 57, 70, 0.4),
              0 0 40px rgba(230, 57, 70, 0.3),
              0 0 60px rgba(230, 57, 70, 0.2)
            `,
          }}
          onClick={handleEnter}
        >
          [ CLICK TO ENTER ]
        </p>
        </div>

        {/* Philosophical text */}
        <div
          style={{
            position: 'fixed',
            bottom: isMobile ? '15px' : '25px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: getContentWidth(),
            maxWidth: '650px',
            textAlign: 'center',
            fontSize: isMobile ? '7px' : '8px',
            lineHeight: '2',
            color: ACCENT,
            opacity: philosophicalText.length > 0 ? 0.45 : 0,
            fontFamily: activeFont.family,
            letterSpacing: '0.15em',
            fontWeight: '300',
            pointerEvents: 'none',
            transition: 'opacity 1s ease',
          }}
        >
          {philosophicalText}
          {showPhilosophicalCursor && (
            <span style={{ opacity: 0.7 }}>▌</span>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes subtleFloat {
          0%, 100% { 
            transform: scale(1.05) translate(0, 0);
          }
          25% {
            transform: scale(1.06) translate(0.5%, -0.3%);
          }
          50% { 
            transform: scale(1.05) translate(0.2%, 0.5%);
          }
          75% {
            transform: scale(1.04) translate(-0.3%, 0.2%);
          }
        }
        @keyframes glitchyGlow {
          0% {
            text-shadow: 
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0);
          }
          5% {
            text-shadow: 
              0 0 2px rgba(230, 57, 70, 0.3),
              0 0 4px rgba(230, 57, 70, 0.2),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0);
          }
          8% {
            text-shadow: 
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0);
          }
          12% {
            text-shadow: 
              0 0 5px rgba(230, 57, 70, 0.5),
              0 0 10px rgba(230, 57, 70, 0.3),
              0 0 15px rgba(230, 57, 70, 0.2),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0);
          }
          15% {
            text-shadow: 
              0 0 2px rgba(230, 57, 70, 0.2),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0);
          }
          20% {
            text-shadow: 
              0 0 8px rgba(230, 57, 70, 0.6),
              0 0 15px rgba(230, 57, 70, 0.4),
              0 0 25px rgba(230, 57, 70, 0.3),
              0 0 35px rgba(230, 57, 70, 0.2),
              0 0 0px rgba(230, 57, 70, 0);
          }
          22% {
            text-shadow: 
              0 0 3px rgba(230, 57, 70, 0.3),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0);
          }
          28% {
            text-shadow: 
              0 0 10px rgba(230, 57, 70, 0.7),
              0 0 20px rgba(230, 57, 70, 0.5),
              0 0 30px rgba(230, 57, 70, 0.4),
              0 0 40px rgba(230, 57, 70, 0.3),
              0 0 50px rgba(230, 57, 70, 0.15);
          }
          30% {
            text-shadow: 
              0 0 5px rgba(230, 57, 70, 0.4),
              0 0 10px rgba(230, 57, 70, 0.2),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0),
              0 0 0px rgba(230, 57, 70, 0);
          }
          35% {
            text-shadow: 
              0 0 10px rgba(230, 57, 70, 0.8),
              0 0 20px rgba(230, 57, 70, 0.6),
              0 0 30px rgba(230, 57, 70, 0.4),
              0 0 40px rgba(230, 57, 70, 0.3),
              0 0 60px rgba(230, 57, 70, 0.2);
          }
          100% {
            text-shadow: 
              0 0 10px rgba(230, 57, 70, 0.8),
              0 0 20px rgba(230, 57, 70, 0.6),
              0 0 30px rgba(230, 57, 70, 0.4),
              0 0 40px rgba(230, 57, 70, 0.3),
              0 0 60px rgba(230, 57, 70, 0.2);
          }
        }
      `}</style>
    </div>
  )
}

export default Home
