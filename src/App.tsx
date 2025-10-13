import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Prevent body scroll on mobile home page
  useEffect(() => {
    const isHomeMobile = currentPage === 'home' && isMobile
    if (isHomeMobile) {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
    } else {
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
    
    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
  }, [currentPage, isMobile])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />
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
        return <Home onNavigate={setCurrentPage} />
    }
  }

  const isHomeMobile = currentPage === 'home' && isMobile

  return (
    <div 
      style={{ 
        backgroundColor: '#000000',
        height: isHomeMobile ? '100vh' : 'auto',
        minHeight: isHomeMobile ? 'auto' : '100vh',
        width: '100%',
        position: 'relative',
        overflow: isHomeMobile ? 'hidden' : 'visible',
      }}
    >
      {/* Falling code background */}
      <FallingCode />
      
      {/* Sticky header - only show on non-home pages */}
      {currentPage !== 'home' && (
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
      
      {/* Dynamic content - no URL changes */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {renderPage()}
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/epk" element={<EPK />} />
        <Route path="*" element={<MainApp />} />
      </Routes>
    </Router>
  )
}

export default App
