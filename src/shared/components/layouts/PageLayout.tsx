import { ReactNode, useEffect, useRef, useState, useMemo } from 'react'
import { activeFont } from '@/design/fonts'

interface PageLayoutProps {
  title: string
  subtitle?: string
  displayText?: string
  showCursor?: boolean
  backgroundImage?: string
  children: ReactNode
  stickyHeader?: boolean
}

function PageLayout({ title, subtitle, displayText, showCursor, backgroundImage, children, stickyHeader = false }: PageLayoutProps) {
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Responsive subtitle font size
  const subtitleFontSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const minSize = 10 // Smaller on mobile
    const maxSize = 13

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    const size = minSize + (maxSize - minSize) * ratio

    return `${size}px`
  }, [viewportWidth])

  useEffect(() => {
    if (!subtitleRef.current) return

    // Add keyframes for shimmer animation
    const styleSheet = document.styleSheets[0]
    const shimmerKeyframes = `
      @keyframes shimmer {
        0% {
          background-position: -200% center;
        }
        100% {
          background-position: 200% center;
        }
      }
    `
    
    // Check if animation already exists
    let animationExists = false
    try {
      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        if (styleSheet.cssRules[i].cssText.includes('shimmer')) {
          animationExists = true
          break
        }
      }
    } catch (e) {
      // Some stylesheets may not be accessible
    }

    if (!animationExists) {
      try {
        styleSheet.insertRule(shimmerKeyframes, styleSheet.cssRules.length)
      } catch (e) {
        // Fail silently
      }
    }
  }, [])

  return (
    <div style={{
      paddingTop: stickyHeader ? '0' : '100px', // Increased for fixed nav
      paddingBottom: '60px',
      paddingLeft: '20px',
      paddingRight: '20px',
      position: 'relative',
    }}>
      {/* SVG filter for horizontal motion blur and grayscale */}
      <svg style={{ position: 'absolute', width: 0, height: 0, top: 0, left: 0 }}>
        <defs>
          <filter id="pageMotionBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12,0" result="blur" />
            {/* Convert to grayscale */}
            <feColorMatrix in="blur" type="matrix" values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      {/* Background image - beneath everything */}
      {backgroundImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: '50% 40%',
            backgroundRepeat: 'no-repeat',
            opacity: 0.15, // More subtle for content pages
            zIndex: -1,
            pointerEvents: 'none',
            filter: 'url(#pageMotionBlur)',
          }}
        />
      )}

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '20px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '10px',
          paddingTop: stickyHeader ? '100px' : '0',
          minHeight: '60px', // Reserve space for title + subtitle to prevent layout shift
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          ...(stickyHeader && {
            position: 'sticky',
            top: 0,
            backgroundColor: '#000000',
            zIndex: 10,
            marginLeft: '-20px',
            marginRight: '-20px',
            paddingLeft: '20px',
            paddingRight: '20px',
          }),
        }}>
          <h1 style={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: '42px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            fontFamily: activeFont.family,
            margin: 0,
            textShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
          }}>
            {title}
          </h1>
          
          {/* Always render subtitle element to prevent layout shift */}
          <p
            ref={subtitleRef}
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: subtitleFontSize,
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              margin: '8px 0 0 0',
              whiteSpace: 'nowrap', // Always stay on one line
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              position: 'relative',
            }}
            >
              <span style={{ display: 'inline-block', position: 'relative' }}>
                {displayText || subtitle}
                {showCursor && (
                  <span
                    style={{
                      position: 'absolute',
                      right: '-0.6em',
                      top: '0.23em',
                      opacity: 0.9,
                      display: 'inline-block',
                      width: '2px',
                      height: '1.2em',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 0 6px rgba(255, 255, 255, 0.4), 0 0 10px rgba(255, 255, 255, 0.2)',
                    }}
                  />
                )}
              </span>
          </p>
        </div>

        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default PageLayout

