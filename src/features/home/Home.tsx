import { Link } from 'react-router-dom'
import { Card, Button, GlowText } from '@/shared/components/atoms'
import { colors, gradients } from '@/design'

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-20 animate-pulse-slow"
          style={{
            backgroundImage: gradients.neon.blue,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-black tracking-tight">
              <GlowText variant="cyan" intensity="lg">
                SUITE 52
              </GlowText>
            </h1>
            
            <p 
              className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide max-w-3xl mx-auto"
              style={{
                color: colors.text.secondary,
              }}
            >
              At the forefront of{' '}
              <span style={{ color: colors.text.primary }}>technology</span>,{' '}
              <span style={{ color: colors.accent.medium }}>culture</span>, and{' '}
              <span style={{ color: colors.text.primary }}>creativity</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/music">
                <Button variant="primary" size="lg">
                  Listen Now
                </Button>
              </Link>
              <Link to="/shows">
                <Button variant="ghost" size="lg">
                  See Shows
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Link to="/music" className="group">
            <Card variant="default" className="p-8 h-full">
              <div className="space-y-4">
                <div 
                  className="text-4xl font-display font-bold"
                  style={{ color: colors.text.primary }}
                >
                  MUSIC
                </div>
                <p style={{ color: colors.text.tertiary }} className="text-sm sm:text-base">
                  Technical, digital production. Introspective soundscapes pushing the boundaries of electronic music.
                </p>
                <div 
                  className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: colors.text.primary }}
                >
                  Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/live-sets" className="group">
            <Card variant="default" className="p-8 h-full">
              <div className="space-y-4">
                <div 
                  className="text-4xl font-display font-bold"
                  style={{ color: colors.text.primary }}
                >
                  LIVE SETS
                </div>
                <p style={{ color: colors.text.tertiary }} className="text-sm sm:text-base">
                  Recorded performances and DJ sets. Experience the evolution of sound through live performance.
                </p>
                <div 
                  className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: colors.text.primary }}
                >
                  Watch <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/shows" className="group">
            <Card variant="default" className="p-8 h-full">
              <div className="space-y-4">
                <div 
                  className="text-4xl font-display font-bold"
                  style={{ color: colors.text.primary }}
                >
                  SHOWS
                </div>
                <p style={{ color: colors.text.tertiary }} className="text-sm sm:text-base">
                  Upcoming performances and events. Join us as we explore the future of music.
                </p>
                <div 
                  className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: colors.text.primary }}
                >
                  Tickets <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Card variant="elevated" className="p-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            <GlowText variant="cyan" intensity="md">
              STAY CONNECTED
            </GlowText>
          </h2>
          <p 
            className="text-lg mb-8"
            style={{ color: colors.text.tertiary }}
          >
            Follow the journey. Be part of something beyond the ordinary.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Get in Touch
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default Home
