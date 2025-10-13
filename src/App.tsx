import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />
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
        return <Home />
    }
  }

  return (
    <div 
      style={{ 
        backgroundColor: '#000000',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Falling code background */}
      <FallingCode />
      
      {/* Sticky header */}
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      
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
