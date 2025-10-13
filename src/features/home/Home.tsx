import { Link } from 'react-router-dom'
import { colors } from '@/design'

function Home() {
  const pages = [
    { to: '/about', label: 'ABOUT', description: 'Learn about Suite 52' },
    { to: '/music', label: 'MUSIC', description: 'Latest releases and catalog' },
    { to: '/live-sets', label: 'LIVE SETS', description: 'Recorded performances' },
    { to: '/shows', label: 'SHOWS', description: 'Upcoming events' },
    { to: '/contact', label: 'CONTACT', description: 'Get in touch' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-16 sm:mb-24">
          <h1 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tight mb-6"
            style={{ color: colors.text.primary }}
          >
            SUITE 52
          </h1>
          <p 
            className="text-lg sm:text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto"
            style={{ color: colors.text.secondary }}
          >
            Technical. Digital. At the forefront of sound.
          </p>
        </header>

        {/* Navigation Grid - Mobile: Stack, Desktop: Grid */}
        <nav className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {pages.map((page) => (
            <Link
              key={page.to}
              to={page.to}
              className="block group"
            >
              <div
                className="p-8 border transition-all duration-300 hover:border-white"
                style={{
                  borderColor: colors.border.default,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.border.highlight
                  e.currentTarget.style.backgroundColor = 'rgba(38, 38, 38, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border.default
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
                }}
              >
                <h2 
                  className="text-2xl sm:text-3xl font-display font-bold mb-2 transition-all duration-300"
                  style={{ color: colors.text.primary }}
                >
                  {page.label}
                </h2>
                <p 
                  className="text-sm sm:text-base"
                  style={{ color: colors.text.tertiary }}
                >
                  {page.description}
                </p>
                <div 
                  className="mt-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: colors.text.secondary }}
                >
                  Enter <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </nav>

        {/* Footer note */}
        <footer className="text-center mt-16 sm:mt-24">
          <p 
            className="text-sm tracking-wide"
            style={{ color: colors.text.muted }}
          >
            Introspective. Deep. Technical.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Home
