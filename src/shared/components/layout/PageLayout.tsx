import { ReactNode, useEffect, useRef, useState, useMemo } from 'react'
import { activeFont } from '@/themes'

interface PageLayoutProps {
  title: string
  subtitle?: string
  displayText?: string
  showCursor?: boolean
  backgroundImage?: string
  backgroundPositionOverride?: string
  children: ReactNode
}

function PageLayout({ title, subtitle, displayText, showCursor, backgroundImage, backgroundPositionOverride, children }: PageLayoutProps) {
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)
  const [titleAnimated, setTitleAnimated] = useState(false)
  const [navHeight, setNavHeight] = useState(80) // Default estimate
  const [headerHeight, setHeaderHeight] = useState(70) // Default estimate

  // Calculate smooth background size based on viewport aspect ratio - same as home page
  const getBackgroundSize = () => {
    // On mobile/portrait: make image BIGGER than viewport so positioning works
    // On desktop/landscape: constrain by width
    const aspectRatio = viewportWidth / window.innerHeight

    if (aspectRatio < 0.8) {
      // Portrait/mobile: make image 150% of viewport height so we can crop/position it
      return 'auto 150%'
    } else {
      // Landscape/desktop: constrain by width
      return '100% auto'
    }
  }

  // Calculate smooth background position - same logic as home page
  const getBackgroundPosition = () => {
    const minWidth = 375 // Mobile minimum
    const maxWidth = 1920 // Desktop maximum

    // Calculate ratio: 0 at mobile, 1 at desktop
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)

    // Ease-out transition - stays very high near desktop value, minimal dip throughout
    // Mobile: 95% (subject positioned high), Desktop: 52.5% (centered, subject visible)
    // Using very small exponent to minimize dip in middle ranges
    const easedRatio = Math.pow(ratio, 0.25) // Very aggressive curve - stays high almost entire transition
    const verticalPercent = 95 + (easedRatio * -42.5) // Range from 95% down to 52.5%

    return `center ${verticalPercent}%`
  }

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Measure navigation and header heights dynamically
  useEffect(() => {
    const measureHeights = () => {
      // Measure navigation height
      const navElement = document.querySelector('nav')
      if (navElement) {
        const navRect = navElement.getBoundingClientRect()
        setNavHeight(navRect.height)
      }

      // Measure header height
      if (headerRef.current) {
        const headerRect = headerRef.current.getBoundingClientRect()
        setHeaderHeight(headerRect.height)
      }
    }

    // Measure immediately
    measureHeights()

    // Measure again after a short delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(measureHeights, 100)

    // Also measure on resize
    window.addEventListener('resize', measureHeights)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', measureHeights)
    }
  }, [viewportWidth])

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
      @keyframes titleSlideIn {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `
    
    // Check if animations already exist
    let shimmerExists = false
    let titleSlideInExists = false
    try {
      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const cssText = styleSheet.cssRules[i].cssText
        if (cssText.includes('shimmer')) {
          shimmerExists = true
        }
        if (cssText.includes('titleSlideIn')) {
          titleSlideInExists = true
        }
      }
    } catch (e) {
      // Some stylesheets may not be accessible
    }

    if (!shimmerExists || !titleSlideInExists) {
      try {
        styleSheet.insertRule(shimmerKeyframes, styleSheet.cssRules.length)
      } catch (e) {
        // Fail silently
      }
    }
      }, [])

      // Preload background image for fade-in effect
      useEffect(() => {
        if (backgroundImage) {
          setBackgroundLoaded(false)
          const img = new Image()
          img.src = backgroundImage
          img.onload = () => {
            setBackgroundLoaded(true)
          }
        }
      }, [backgroundImage])

      // Trigger title animation
      useEffect(() => {
        const timer = setTimeout(() => {
          setTitleAnimated(true)
          if (titleRef.current) {
            titleRef.current.style.opacity = '1'
            titleRef.current.style.transform = 'translateY(0)'
          }
        }, 100)
        return () => clearTimeout(timer)
      }, [])

      return (
    <div style={{
      paddingTop: '0px', // No padding needed - fixed header handles spacing
      paddingBottom: '60px',
      paddingLeft: '20px',
      paddingRight: '20px',
      position: 'relative',
      backgroundColor: 'rgba(255, 255, 0, 0.2)', // DEBUG: Yellow background for main container
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
            backgroundSize: getBackgroundSize(),
            backgroundPosition: backgroundPositionOverride || getBackgroundPosition(),
            backgroundRepeat: 'no-repeat',
            opacity: backgroundLoaded ? 0.15 : 0, // More subtle for content pages
            zIndex: -1,
            pointerEvents: 'none',
            filter: 'url(#pageMotionBlur)',
            transition: 'opacity 1.5s ease-in',
          }}
        />
      )}

      {/* Fixed Header */}
      <div
        ref={headerRef}
        style={{
          position: 'fixed',
          top: navHeight, // Below the measured navigation height
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 0, 0, 0.3)', // DEBUG: Red background
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '10px',
          minHeight: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'left',
          zIndex: 50,
        }}
      >
        <div style={{
          maxWidth: '900px',
          margin: '0 auto', // Center like content containers
          paddingLeft: '20px',
          paddingRight: '20px',
        }}>
          <h1
            ref={titleRef}
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: '42px',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              fontFamily: activeFont.family,
              margin: 0,
              textAlign: 'left',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              opacity: 0,
              transform: 'translateY(20px)',
              transition: 'opacity 1.0s ease-out 0.3s, transform 0.8s ease-out 0.3s',
            }}
          >
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
              textAlign: 'left',
              whiteSpace: 'nowrap', // Always stay on one line
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              position: 'relative',
            }}
            >
              <span style={{ display: 'inline-block', position: 'relative' }}>
                {displayText || subtitle}
                {showCursor && displayText && (
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
      </div>

      {/* Content Container - starts below divider */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        paddingLeft: '20px',
        paddingRight: '20px',
        marginTop: `${navHeight + headerHeight}px`, // Start below navigation + header
        backgroundColor: 'rgba(0, 255, 0, 0.3)', // DEBUG: Green background
      }}>
        {/* Content */}
        <div style={{
          marginTop: 0,
          paddingTop: 0,
          width: '100%', // Fill full width of green container
          backgroundColor: 'rgba(0, 0, 255, 0.3)', // DEBUG: Blue background
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default PageLayout

