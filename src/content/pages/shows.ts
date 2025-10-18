/**
 * Shows page content
 */
export const showsContent = {
  title: 'UPCOMING_SHOWS',
  codeSnippet: '// EVENTS.filter(e => new Date(e.date) >= Date.now()).map(show => show)',
  emptyState: {
    title: 'No upcoming shows',
    description: 'Check back soon for new events!',
  },
  labels: {
    date: 'Date',
    venue: 'Venue',
    location: 'Location',
    tickets: 'Get Tickets',
    pastShows: 'Past Events',
  },
} as const
