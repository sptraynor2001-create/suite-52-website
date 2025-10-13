import { shows } from './data'

function Shows() {
  // Sort shows by date (upcoming first)
  const sortedShows = [...shows].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const upcomingShows = sortedShows.filter(
    show => new Date(show.date) >= new Date()
  )

  const pastShows = sortedShows.filter(
    show => new Date(show.date) < new Date()
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const ShowCard = ({ show }: { show: typeof shows[0] }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {show.image && (
        <div className="h-48 sm:h-64 bg-gray-200">
          <img 
            src={show.image} 
            alt={`${show.venue} - ${show.city}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Show+Image'
            }}
          />
        </div>
      )}
      
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
          <div className="mb-2 sm:mb-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {show.venue}
            </h2>
            <p className="text-gray-600">
              {show.city}{show.state && `, ${show.state}`}
              {show.country && `, ${show.country}`}
            </p>
          </div>
          {show.isSoldOut && (
            <span className="inline-block px-3 py-1 text-sm font-semibold text-red-800 bg-red-100 rounded-full">
              SOLD OUT
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-gray-700">
            <span className="font-semibold">Date:</span> {formatDate(show.date)}
          </p>
          {show.time && (
            <p className="text-gray-700">
              <span className="font-semibold">Time:</span> {show.time}
            </p>
          )}
        </div>

        {show.description && (
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            {show.description}
          </p>
        )}

        {show.ticketUrl && !show.isSoldOut && (
          <a
            href={show.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto text-center px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition font-medium"
          >
            Get Tickets
          </a>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Shows</h1>

      {upcomingShows.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Upcoming Shows
          </h2>
          <div className="space-y-6">
            {upcomingShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      )}

      {pastShows.length > 0 && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Past Shows
          </h2>
          <div className="space-y-6 opacity-75">
            {pastShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      )}

      {shows.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No shows scheduled yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}

export default Shows
