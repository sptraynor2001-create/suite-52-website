import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'

function Navigation() {
  const location = useLocation()
  const navContainerRef = useRef<HTMLDivElement>(null)

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/about', label: 'ABOUT' },
    { to: '/music', label: 'MUSIC' },
    { to: '/live-sets', label: 'LIVE SETS' },
    { to: '/shows', label: 'SHOWS' },
    { to: '/contact', label: 'CONTACT' },
  ]

  useEffect(() => {
    if (navContainerRef.current) {
      const rect = navContainerRef.current.getBoundingClientRect()
      console.log('Navigation container dimensions:', {
        width: rect.width,
        height: rect.height,
        screenWidth: window.innerWidth,
        percentageOfScreen: (rect.width / window.innerWidth * 100).toFixed(2) + '%'
      })
    }
  }, [])

  const isActive = (path: string) => location.pathname === path

  return (
    <nav 
      className="w-full py-6"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="flex justify-center items-center">
        <div 
          ref={navContainerRef}
          className="flex justify-between items-center" 
          style={{ width: '70%' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium tracking-widest transition-all duration-300"
              style={{
                color: isActive(link.to) ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.to)) {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
