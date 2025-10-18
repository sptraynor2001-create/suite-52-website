/**
 * Live Sets page content
 */
export const liveSetsContent = {
  title: 'LIVE_SETS',
  codeSnippet: '// RECORDINGS.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)',
  videos: {
    youtube: {
      title: 'Suite 52 B2B Henry McBride in NYC with Element',
      description: 'Live performance featuring special guest Element',
    },
    soundcloud: {
      title: 'UMANO Radio',
      description: 'Radio mix session for UMANO',
    },
  },
  labels: {
    watch: 'Watch',
    listen: 'Listen',
    recordings: 'Live Recordings',
  },
} as const
