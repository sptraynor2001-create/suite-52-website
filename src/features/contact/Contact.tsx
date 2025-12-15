/**
 * Contact - Contact page with neural network 3D background
 */

import { useState, useEffect, useMemo } from 'react'
import { activeFont, backgrounds, breakpoints } from '@/themes'
import { tokens } from '@/design/tokens'
import { animations } from '@/themes/animations'
import { cardStyles } from '@/design/cardStyles'
import { 
  FaInstagram, 
  FaSpotify, 
  FaSoundcloud, 
  FaYoutube, 
  FaTiktok,
  FaApple,
  FaFacebook,
  FaTwitter
} from 'react-icons/fa'
import { socialLinks as socialLinksData } from './data'
import { ContactScene } from './components/ContactScene'

// Social platform configurations with brand colors and icons
const socialPlatforms = [
  {
    name: 'Instagram',
    key: 'instagram' as keyof typeof socialLinksData,
    icon: FaInstagram,
    color: '#E4405F',
    gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
  },
  {
    name: 'Spotify',
    key: 'spotify' as keyof typeof socialLinksData,
    icon: FaSpotify,
    color: '#1DB954',
    gradient: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
  },
  {
    name: 'SoundCloud',
    key: 'soundcloud' as keyof typeof socialLinksData,
    icon: FaSoundcloud,
    color: '#FF5500',
    gradient: 'linear-gradient(135deg, #FF5500 0%, #ff7700 100%)',
  },
  {
    name: 'YouTube',
    key: 'youtube' as keyof typeof socialLinksData,
    icon: FaYoutube,
    color: '#FF0000',
    gradient: 'linear-gradient(135deg, #FF0000 0%, #ff3333 100%)',
  },
  {
    name: 'TikTok',
    key: 'tiktok' as keyof typeof socialLinksData,
    icon: FaTiktok,
    color: '#00f2ea',
    gradient: 'linear-gradient(135deg, #00f2ea 0%, #ff0050 100%)',
  },
  {
    name: 'Apple Music',
    key: 'appleMusic' as keyof typeof socialLinksData,
    icon: FaApple,
    color: '#FA243C',
    gradient: 'linear-gradient(135deg, #FA243C 0%, #fc5c7d 100%)',
  },
  {
    name: 'Facebook',
    key: 'facebook' as keyof typeof socialLinksData,
    icon: FaFacebook,
    color: '#1877F2',
    gradient: 'linear-gradient(135deg, #1877F2 0%, #4a9ff5 100%)',
  },
  {
    name: 'Twitter',
    key: 'twitter' as keyof typeof socialLinksData,
    icon: FaTwitter,
    color: '#1DA1F2',
    gradient: 'linear-gradient(135deg, #1DA1F2 0%, #0d95e8 100%)',
  },
].filter(platform => socialLinksData[platform.key]) // Only show platforms with URLs

const contactInfo = [
  { label: 'BOOKING', value: 'booking@suite52.art', type: 'email' },
  { label: 'MANAGEMENT', value: 'management@suite52.art', type: 'email' },
  { label: 'PRESS', value: 'info@suite52.art', type: 'email' },
  { label: 'DEMOS/PROMO', value: 'music@suite52.art', type: 'email' },
]

function Contact() {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)
  const [visibleSections, setVisibleSections] = useState(0)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [hoveredContact, setHoveredContact] = useState<string | null>(null)
  
  // Combine contact methods for 3D scene
  const contactMethods = useMemo(() => {
    const methods = [
      ...contactInfo.map(info => ({
        id: `email-${info.label.toLowerCase().replace(/\s+/g, '-')}`,
        label: info.label,
        value: info.value,
        type: 'email' as const,
      })),
      ...socialPlatforms.map(platform => ({
        id: `social-${platform.name.toLowerCase()}`,
        label: platform.name,
        value: socialLinksData[platform.key] as string,
        type: 'social' as const,
      })),
    ]
    return methods
  }, [])

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Stagger reveals
  useEffect(() => {
    let currentSection = 0
    const totalSections = 3

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

  const titleSize = useMemo(() => {
    const minWidth = 375
    const maxWidth = 1920
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, viewportWidth))
    const ratio = (clampedWidth - minWidth) / (maxWidth - minWidth)
    return `${28 + (42 - 28) * ratio}px`
  }, [viewportWidth])

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 3D Background Scene */}
      <ContactScene contactMethods={contactMethods} hoveredContact={hoveredContact} />
      
      {/* Background image */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url(/images/backgrounds/contact-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: viewportWidth >= breakpoints.tablet ? backgrounds.contact.position.desktop : backgrounds.contact.position.mobile,
          opacity: 0,
          filter: `blur(${backgrounds.contact.blur}) saturate(${backgrounds.contact.saturation})`,
          zIndex: tokens.zIndex.background,
          pointerEvents: 'none',
          animation: `fadeInBackground015 ${animations.page.background.fadeIn} ease-in forwards`,
        }}
      />
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
            maxWidth: '700px',
            margin: '0 auto 12px',
            textAlign: 'left',
          }}
        >
          <h1
            style={{
              color: '#ffffff',
              fontSize: titleSize,
              fontWeight: '700',
              letterSpacing: '-0.02em',
              fontFamily: activeFont.family,
              margin: 0,
              textShadow: '0 0 30px rgba(255, 255, 255, 0.2)',
              animation: 'slideUp 0.6s ease-out 0.1s both',
            }}
          >
            CONTACT
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: viewportWidth <= breakpoints.mobile ? '11px' : viewportWidth <= breakpoints.tablet ? '12px' : '12px',
              fontFamily: activeFont.family,
              letterSpacing: '0.1em',
              margin: '12px 0 0 0',
              animation: 'slideUp 0.6s ease-out 0.2s both',
            }}
          >
            {'// OPEN_CHANNEL :: protocol.establish(signal => response)'}
          </p>
        </div>

        {/* Contact Info */}
        <div
          style={{
            maxWidth: '700px',
            margin: '0 auto 32px',
            opacity: visibleSections >= 1 ? 1 : 0,
            transform: visibleSections >= 1 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          <div
            style={{
              ...cardStyles.base,
              padding: '28px 32px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  style={{
                    display: 'flex',
                    flexDirection: viewportWidth < 500 ? 'column' : 'row',
                    alignItems: viewportWidth < 500 ? 'flex-start' : 'center',
                    gap: viewportWidth < 500 ? '4px' : '16px',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '12px',
                      fontFamily: activeFont.family,
                      letterSpacing: '0.1em',
                      minWidth: '120px',
                    }}
                  >
                    {info.label}
                  </span>
                  <a
                    href={`mailto:${info.value}`}
                    style={{
                      color: '#ffffff',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#e63946'
                      setHoveredContact(`email-${info.label.toLowerCase().replace(/\s+/g, '-')}`)
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#ffffff'
                      setHoveredContact(null)
                    }}
                  >
                    {info.value}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '0 auto',
            opacity: visibleSections >= 2 ? 1 : 0,
            transform: visibleSections >= 2 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s',
          }}
        >
          {/* Liquid glass background */}
          <div
            style={{
              position: 'relative',
              padding: '32px 40px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Animated liquid glass effect */}
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                animation: 'liquidGlassFlow 8s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle at 70% 70%, rgba(230, 57, 70, 0.08) 0%, transparent 50%)',
                animation: 'liquidGlassFlow 12s ease-in-out infinite reverse',
                pointerEvents: 'none',
              }}
            />
            
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
            {socialPlatforms.map((platform) => {
              const isHovered = hoveredLink === platform.name
              const Icon = platform.icon
              const url = socialLinksData[platform.key] as string

              return (
                <a
                  key={platform.name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={platform.name}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isHovered ? platform.color : 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: '10px',
                    textDecoration: 'none',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isHovered ? 'translateY(-3px) scale(1.08)' : 'translateY(0) scale(1)',
                    boxShadow: isHovered 
                      ? `0 4px 16px ${platform.color}50, 0 0 24px ${platform.color}30` 
                      : '0 2px 4px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={() => {
                    setHoveredLink(platform.name)
                    setHoveredContact(`social-${platform.name.toLowerCase()}`)
                  }}
                  onMouseLeave={() => {
                    setHoveredLink(null)
                    setHoveredContact(null)
                  }}
                >
                  {/* Background gradient effect on hover */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: platform.gradient,
                      opacity: isHovered ? 0.15 : 0,
                      transition: 'opacity 0.25s ease',
                      pointerEvents: 'none',
                    }}
                  />
                  
                  {/* Icon */}
                  <div
                    style={{
                      position: 'relative',
                      fontSize: '20px',
                      color: isHovered ? platform.color : 'rgba(255, 255, 255, 0.7)',
                      transition: 'all 0.25s ease',
                      filter: isHovered ? `drop-shadow(0 0 8px ${platform.color})` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon />
                  </div>
                </a>
              )
            })}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p
          style={{
            maxWidth: '700px',
            margin: '24px auto 0',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: viewportWidth <= 768 ? '9px' : '12px',
            fontFamily: activeFont.family,
            letterSpacing: '0.1em',
            opacity: visibleSections >= 3 ? 1 : 0,
            transition: 'opacity 1s ease-out 2s',
          }}
        >
          [ THE SIGNAL SEARCHES FOR THOSE WILLING TO LISTEN ]
        </p>
      </div>

      <style>{`
        @keyframes fadeInBackground015 {
          from { opacity: 0; }
          to { opacity: ${backgrounds.contact.opacity}; }
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
        @keyframes liquidGlassFlow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(10%, -10%) scale(1.1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-5%, 5%) scale(0.9);
            opacity: 0.4;
          }
          75% {
            transform: translate(-10%, 10%) scale(1.05);
            opacity: 0.45;
          }
        }
      `}</style>
    </div>
  )
}

export default Contact
