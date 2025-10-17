import { ReactNode, useEffect, useRef } from 'react'
import { activeFont } from '@/design/fonts'

interface PageLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  const subtitleRef = useRef<HTMLParagraphElement>(null)

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
      minHeight: '100vh',
      backgroundColor: '#000000',
      padding: '60px 20px',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '40px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '20px',
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
          
          {subtitle && (
            <p 
              ref={subtitleRef}
              style={{
                background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.28) 20%, rgba(255, 255, 255, 0.38) 40%, rgba(255, 255, 255, 0.28) 60%, rgba(255, 255, 255, 0.2) 100%)',
                backgroundSize: '200% auto',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                fontSize: '13px',
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                margin: '8px 0 0 0',
                animation: 'shimmer 8s linear infinite',
                filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.1))',
              }}
            >
              {subtitle}
            </p>
          )}
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

