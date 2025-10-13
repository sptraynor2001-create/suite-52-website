import { songs } from './data'

function Music() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Music</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song) => (
          <div 
            key={song.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            {song.coverImage && (
              <div className="aspect-square bg-gray-200">
                <img 
                  src={song.coverImage} 
                  alt={song.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image'
                  }}
                />
              </div>
            )}
            
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {song.title}
              </h2>
              {song.artist && (
                <p className="text-gray-600 mb-2">{song.artist}</p>
              )}
              <p className="text-sm text-gray-500 mb-4">
                {new Date(song.releaseDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              
              {song.description && (
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                  {song.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2">
                {song.spotifyUrl && (
                  <a
                    href={song.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
                  >
                    Spotify
                  </a>
                )}
                {song.appleMusicUrl && (
                  <a
                    href={song.appleMusicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700 transition"
                  >
                    Apple Music
                  </a>
                )}
                {song.youtubeUrl && (
                  <a
                    href={song.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                  >
                    YouTube
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {songs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No music releases yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}

export default Music

