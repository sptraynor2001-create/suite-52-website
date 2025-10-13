import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              Suite 52
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 sm:mb-10">
              Discover our music, shows, and more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/music" 
                className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Listen Now
              </Link>
              <Link 
                to="/shows" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition"
              >
                See Shows
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Link 
            to="/music" 
            className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition group"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
              Music
            </h2>
            <p className="text-gray-600">
              Check out our latest releases and catalog
            </p>
          </Link>

          <Link 
            to="/shows" 
            className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition group"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
              Shows
            </h2>
            <p className="text-gray-600">
              See where we're performing next
            </p>
          </Link>

          <Link 
            to="/about" 
            className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition group"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
              About
            </h2>
            <p className="text-gray-600">
              Learn more about Suite 52
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
