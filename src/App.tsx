import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from '@/shared/components/Navigation'
import Home from '@/features/home'
import About from '@/features/about'
import Contact from '@/features/contact'
import Music from '@/features/music'
import LiveSets from '@/features/live-sets'
import Shows from '@/features/shows'
import EPK from '@/features/epk'

function App() {
  return (
    <Router>
      <div 
        className="min-h-screen"
        style={{ backgroundColor: '#000000' }}
      >
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/music" element={<Music />} />
          <Route path="/live-sets" element={<LiveSets />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/epk" element={<EPK />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
