import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './shared/components'
import Home from './features/home'
import About from './features/about'
import Music from './features/music'
import LiveSets from './features/live-sets'
import Shows from './features/shows'
import Contact from './features/contact'
import EPK from './features/epk'
import { gradients } from '@/design'

function App() {
  return (
    <Router>
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          background: '#000000',
          backgroundImage: gradients.midnight.vertical,
        }}
      >
        {/* Mesh gradient overlay */}
        <div 
          className="fixed inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: gradients.mesh,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/music" element={<Music />} />
            <Route path="/live-sets" element={<LiveSets />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/epk" element={<EPK />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
