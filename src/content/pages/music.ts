/**
 * Music page content
 */
export const musicContent = {
  title: 'RELEASES',
  codeSnippet: '// MUSIC.sort((a, b) => new Date(b.date) - new Date(a.date))',
  emptyState: {
    title: 'No releases yet',
    description: 'New music coming soon. Stay tuned!',
  },
  labels: {
    streamingLinks: 'Listen Now',
    releaseDate: 'Released',
    upcoming: 'Coming Soon',
  },
} as const
