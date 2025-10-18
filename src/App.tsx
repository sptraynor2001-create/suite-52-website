import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navigation from '@/shared/components/Navigation'
import FallingCode from '@/shared/components/FallingCode'
import Home from '@/features/home'
import About from '@/features/about'
import Contact from '@/features/contact'
import Music from '@/features/music'
import LiveSets from '@/features/live-sets'
import Shows from '@/features/shows'
import EPK from '@/features/epk'

type Page = 'home' | 'about' | 'music' | 'live-sets' | 'shows' | 'contact'

function MainApp() {
  const location = useLocation()
  const navigate = useNavigate()

  const getCurrentPage = (): Page => {
    const path = location.pathname.slice(1) // Remove leading slash
    switch (path) {
      case 'about':
        return 'about'
      case 'music':
        return 'music'
      case 'live-sets':
        return 'live-sets'
      case 'shows':
        return 'shows'
      case 'contact':
        return 'contact'
      default:
        return 'about'
    }
  }

  const currentPage = getCurrentPage()

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />
      case 'music':
        return <Music />
      case 'live-sets':
        return <LiveSets />
      case 'shows':
        return <Shows />
      case 'contact':
        return <Contact />
      default:
        return <About />
    }
  }

  const handleNavigate = (page: Page) => {
    if (page === 'home') {
      navigate('/')
    } else {
      navigate(`/${page}`)
    }
  }

  return (
    <div
      style={{
        backgroundColor: '#000000',
        height: 'auto',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Falling code background */}
      <FallingCode />

      {/* Sticky header */}
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Dynamic content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {renderPage()}
      </div>
    </div>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Prevent body scroll on mobile home page - more aggressive approach for Safari
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = '0'
      document.body.style.left = '0'
    } else {
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      document.body.style.left = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      document.body.style.left = ''
    }
  }, [isMobile])

  const handleNavigate = (page: Page) => {
    navigate(`/${page}`)
  }

  return (
    <div
      style={{
        backgroundColor: '#000000',
        height: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Falling code background */}
      <FallingCode />

      {/* Home content - no navigation header */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Home onNavigate={handleNavigate} />
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<MainApp />} />
        <Route path="/music" element={<MainApp />} />
        <Route path="/live-sets" element={<MainApp />} />
        <Route path="/shows" element={<MainApp />} />
        <Route path="/contact" element={<MainApp />} />
        <Route path="/epk" element={<EPK />} />
      </Routes>
    </Router>
  )
}

export default App
