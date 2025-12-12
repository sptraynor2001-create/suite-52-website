import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, Suspense, lazy } from 'react'
import Navigation from '@/shared/components/layout/Navigation'
import FallingCode from '@/shared/components/effects/FallingCode'
import { QualityProvider } from '@/shared/components/3d'

// Lazy load page components for better performance
const Home = lazy(() => import('@/features/home'))
const About = lazy(() => import('@/features/about'))
const Contact = lazy(() => import('@/features/contact'))
const Music = lazy(() => import('@/features/music'))
const LiveSets = lazy(() => import('@/features/live-sets'))
const Shows = lazy(() => import('@/features/shows'))
const EPK = lazy(() => import('@/features/epk'))

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-void">
    <div 
      style={{
        width: '40px',
        height: '40px',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: '#e63946',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

type Page = 'home' | 'about' | 'music' | 'live-sets' | 'shows' | 'contact'

function MainApp() {
  const location = useLocation()
  const navigate = useNavigate()

  const getCurrentPage = (): Page => {
    const path = location.pathname.slice(1)
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

  // Prevent body scroll on mobile home page
  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('mobile-home-no-scroll')
    } else {
      document.body.classList.remove('mobile-home-no-scroll')
    }

    return () => {
      document.body.classList.remove('mobile-home-no-scroll')
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
      {/* Home content with 3D portal scene */}
        <Home onNavigate={handleNavigate} />
    </div>
  )
}

function App() {
  return (
    <QualityProvider>
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<MainApp />} />
          <Route path="/music" element={<MainApp />} />
          <Route path="/live-sets" element={<MainApp />} />
          <Route path="/shows" element={<MainApp />} />
          <Route path="/contact" element={<MainApp />} />
          <Route path="/epk" element={<EPK />} />
        </Routes>
      </Suspense>
    </Router>
    </QualityProvider>
  )
}

export default App
