import { ReactNode } from 'react'

interface MediaEmbedProps {
  type: 'youtube' | 'soundcloud'
  src: string
  title: string
  aspectRatio?: '16/9' | '1/1' | '4/3'
  className?: string
}

function MediaEmbed({ type, src, title, aspectRatio = '16/9', className = '' }: MediaEmbedProps) {
  const getEmbedUrl = (url: string) => {
    if (type === 'youtube') {
      // Extract video ID from various YouTube URL formats
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/
      ]

      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return `https://www.youtube.com/embed/${match[1]}`
      }
      return url // Fallback to provided URL
    }
    return url // SoundCloud URLs are used as-is
  }

  const embedUrl = getEmbedUrl(src)

  if (type === 'youtube') {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          maxWidth: aspectRatio === '16/9' ? '672px' : '400px',
          margin: '0 auto',
          aspectRatio,
        }}
      >
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          title={title}
          className="w-full h-full rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (type === 'soundcloud') {
    return (
      <div className={className}>
        <iframe
          width="100%"
          height="120"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={embedUrl}
          title={title}
          className="w-full rounded-lg sm:h-[166px] h-[120px]"
        />
      </div>
    )
  }

  return null
}

export default MediaEmbed
