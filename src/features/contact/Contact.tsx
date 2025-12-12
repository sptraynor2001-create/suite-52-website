/**
 * Contact - Contact page with neural network 3D background
 */

import { useState, useEffect, useMemo } from 'react'
import { activeFont } from '@/themes'
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
              opacity: visibleSections > 0 ? 1 : 0,
              transform: visibleSections > 0 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
          >
            CONTACT
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: viewportWidth <= 480 ? '8px' : viewportWidth <= 768 ? '10px' : '12px',
              fontFamily: activeFont.family,
              letterSpacing: '0.1em',
              margin: '12px 0 0 0',
              opacity: visibleSections > 0 ? 1 : 0,
              transition: 'opacity 0.8s ease-out 0.2s',
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
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#ffffff'
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
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center',
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
                  onMouseEnter={() => setHoveredLink(platform.name)}
                  onMouseLeave={() => setHoveredLink(null)}
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
    </div>
  )
}

export default Contact
