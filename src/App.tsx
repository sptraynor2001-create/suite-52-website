import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Music from './pages/Music'
import LiveSets from './pages/LiveSets'
import Shows from './pages/Shows'
import EPK from './pages/EPK'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
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
