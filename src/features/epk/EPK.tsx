function EPK() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
        Electronic Press Kit
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-6 text-base sm:text-lg">
            Welcome to Suite 52's Electronic Press Kit. This page contains press 
            materials, high-resolution photos, and other resources for media and 
            industry professionals.
          </p>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bio</h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Add your official press bio here...
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Press Photos</h2>
            <p className="text-gray-700 mb-4 text-base sm:text-lg">
              High-resolution press photos available for download:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Add press photo thumbnails here */}
              <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Press Photo 1</p>
              </div>
              <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Press Photo 2</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Stats & Achievements</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Add streaming numbers</li>
              <li>Notable performances</li>
              <li>Awards and recognition</li>
              <li>Media features</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700 text-base sm:text-lg">
              <span className="font-semibold">Press Inquiries:</span>{' '}
              <a 
                href="mailto:press@suite52.com" 
                className="text-blue-600 hover:text-blue-800 transition"
              >
                press@suite52.com
              </a>
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg mt-8">
            <p className="text-sm text-gray-600">
              🔒 <span className="font-semibold">Note:</span> This page is only 
              accessible via direct URL (/epk) and won't appear in navigation menus.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EPK
