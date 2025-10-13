function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
        About Suite 52
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4 text-base sm:text-lg leading-relaxed">
            Welcome to Suite 52. This is where you can share your story, 
            musical journey, and what makes your sound unique.
          </p>
          
          <p className="text-gray-700 mb-4 text-base sm:text-lg leading-relaxed">
            Edit this page in <code className="text-sm bg-gray-100 px-2 py-1 rounded">
            src/pages/About.tsx
            </code> to add your bio, band members, influences, and more.
          </p>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Band Members
            </h2>
            <p className="text-gray-700 text-base sm:text-lg">
              Add information about your band members here...
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Sound
            </h2>
            <p className="text-gray-700 text-base sm:text-lg">
              Describe your musical style and influences...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
