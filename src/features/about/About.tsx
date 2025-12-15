/**
 * About - Bio page with 3D terrain background
 * Tells the story of Suite 52: software engineer + producer + DJ
 */

import { useState, useEffect, useMemo } from 'react'
import { activeFont, backgrounds, breakpoints } from '@/themes'
import { tokens } from '@/design/tokens'
import { animations } from '@/themes/animations'
import { AboutScene } from './components'
import { cardStyles } from '@/design/cardStyles'
import { colors } from '@/themes/colors'

function About() {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)
  const [visibleSections, setVisibleSections] = useState(0)
  const [hoveredSection, setHoveredSection] = useState<number | null>(null)

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Stagger section reveals
  useEffect(() => {
    let currentSection = 0
    const totalSections = 4 // Only bio sections now

    const showNext = () => {
      if (currentSection < totalSections) {
        setVisibleSections(currentSection + 1)
        currentSection++
        setTimeout(showNext, 200)
      }
    }

    const startDelay = setTimeout(showNext, 400)
    return () => clearTimeout(startDelay)
  }, [])

  // Responsive font sizes
  const titleSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    return `${28 + (42 - 28) * ratio}px`
  }, [viewportWidth])

  const bodySize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    return `${14 + (16 - 14) * ratio}px`
  }, [viewportWidth])

  const sections = [
    {
      title: 'THE_APPROACH',
      content: `Suite 52 operates at the convergence of technical mastery and artistic pursuit. 
        Technology transforms from tool to medium, crafting moments where sound transcends function 
        and becomes experience. Each track, each set, an attempt to articulate what words cannot. 
        The search for something that exists only in the space between intention and interpretation.`,
    },
    {
      title: 'THE_SOUND',
      content: `Sonic architecture built at the intersection of opposing forces. Organic textures layered 
        with digital precision. Darkness giving weight to melody. Emotion grounded by intellect. The work 
        evolves continuously, refusing to settle into predictable patterns. Creating music with enough 
        character to cut through an industry saturated with noise but devoid of voice.`,
    },
    {
      title: 'THE_PHILOSOPHY',
      content: `Art above all. Technology unlocks infinite possibility, but human vision determines what 
        matters. The culture needs architects who understand its foundation, who recognize what separates 
        meaningful work from manufactured product. Building something that demands attention in a landscape 
        where most have chosen silence over substance.`,
    },
    {
      title: 'THE_CREW',
      content: `Co-founder of UMANO, an independent label and events platform forged by five artists who 
        challenge convention daily. Genre-agnostic by design. Mind-bending by necessity. The sound shifts 
        between darkness and melody, aggression and introspection, but everything carries unmistakable 
        personality. This is music that refuses to compromise individuality for conformity.`,
    },
  ]

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background image */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url(/images/backgrounds/about-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: backgrounds.about.position,
          opacity: 0,
          filter: `blur(${backgrounds.about.blur}) saturate(${backgrounds.about.saturation})`,
          zIndex: tokens.zIndex.background,
          pointerEvents: 'none',
          animation: `fadeInBackground015 ${animations.page.background.fadeIn} ease-in forwards`,
        }}
      />
      {/* 3D Background Scene */}
      <AboutScene visibleSections={visibleSections} hoveredSection={hoveredSection} />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '90px',
          paddingBottom: '80px',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        {/* Header */}
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto 12px',
            textAlign: 'left',
          }}
        >
          <h1
            style={{
              color: colors.atmosphere.snow,
              fontSize: titleSize,
              fontWeight: '700',
              letterSpacing: '-0.02em',
              fontFamily: activeFont.family,
              margin: 0,
              background: `linear-gradient(135deg, ${colors.atmosphere.snow} 0%, ${colors.atmosphere.bone} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: `
                0 2px 8px rgba(235, 235, 235, 0.15),
                0 4px 16px rgba(212, 212, 212, 0.1),
                0 0 40px rgba(255, 255, 255, 0.05)
              `,
              animation: 'slideUp 0.6s ease-out 0.1s both',
            }}
          >
            ABOUT
          </h1>
          <p
            style={{
              color: colors.gold.casino,
              fontSize: viewportWidth <= breakpoints.mobile ? '11px' : viewportWidth <= breakpoints.tablet ? '12px' : '12px',
              fontFamily: activeFont.family,
              letterSpacing: '0.1em',
              margin: '6px auto 0',
              animation: 'slideUp 0.6s ease-out 0.2s both',
              backgroundColor: '#000000',
              padding: '4px 8px',
              borderRadius: '4px',
              maxWidth: '800px',
              display: 'block',
            }}
          >
            {'// ENTITY.initialize(vectors: [SOUND, CODE, VISION])'}
          </p>
          </div>

        {/* Bio Sections */}
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {sections.map((section, index) => (
            <div
              key={section.title}
              style={{
                ...cardStyles.base,
                padding: '28px 32px',
                opacity: visibleSections > index ? 1 : 0,
                transform: visibleSections > index ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`,
              }}
              onMouseEnter={() => setHoveredSection(index)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <h2
                style={{
                  color: '#e63946',
                  fontSize: '14px',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  fontFamily: activeFont.family,
                  margin: '0 0 16px 0',
                  textShadow: '0 0 15px rgba(230, 57, 70, 0.4)',
                }}
              >
                {section.title}
            </h2>
              <p
                style={{
                  color: 'rgba(180, 180, 180, 0.9)',
                  fontSize: bodySize,
                  lineHeight: '1.8',
                  fontFamily: activeFont.family,
                  margin: 0,
                  letterSpacing: '0.02em',
                }}
              >
                {section.content}
            </p>
          </div>
          ))}

        </div>
      </div>

      <style>{`
        @keyframes fadeInBackground015 {
          from { opacity: 0; }
          to { opacity: 0.15; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default About
