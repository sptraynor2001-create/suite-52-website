/**
 * Media utility functions for handling embeds, images, and media content
 */

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

/**
 * Convert YouTube URL to embed URL
 */
export function getYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeId(url)
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

/**
 * Get SoundCloud embed parameters
 */
export function getSoundCloudEmbedParams(trackId: string) {
  return {
    url: `https://api.soundcloud.com/tracks/${trackId}`,
    color: '%23ff5500',
    auto_play: false,
    hide_related: false,
    show_comments: true,
    show_user: true,
    show_reposts: false,
    show_teaser: true
  }
}

/**
 * Build SoundCloud embed URL
 */
export function getSoundCloudEmbedUrl(trackId: string): string {
  const params = getSoundCloudEmbedParams(trackId)
  const queryString = new URLSearchParams(params as any).toString()
  return `https://w.soundcloud.com/player/?${queryString}`
}

/**
 * Check if URL is a valid media URL
 */
export function isValidMediaUrl(url: string, type: 'youtube' | 'soundcloud'): boolean {
  if (type === 'youtube') {
    return extractYouTubeId(url) !== null
  }

  if (type === 'soundcloud') {
    // Basic SoundCloud URL validation
    return /soundcloud\.com/.test(url) || /^\d+$/.test(url)
  }

  return false
}

/**
 * Get responsive image srcSet for different screen sizes
 */
export function generateSrcSet(baseUrl: string, sizes: number[] = [480, 768, 1024, 1440]): string {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ')
}

/**
 * Lazy load image with intersection observer
 */
export function createLazyImageLoader() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.classList.remove('lazy')
          observer.unobserve(img)
        }
      }
    })
  })

  return {
    observe: (element: HTMLImageElement) => imageObserver.observe(element),
    disconnect: () => imageObserver.disconnect()
  }
}
