import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link 
              to="/" 
              className="inline-flex items-center px-1 pt-1 text-lg font-semibold text-gray-900 hover:text-gray-600 transition"
            >
              Suite 52
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link 
              to="/" 
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              About
            </Link>
            <Link 
              to="/music" 
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              Music
            </Link>
            <Link 
              to="/shows" 
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              Shows
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

