import {
  extractYouTubeId,
  getYouTubeEmbedUrl,
  getSoundCloudEmbedUrl,
  isValidMediaUrl,
  generateSrcSet,
  createLazyImageLoader
} from './media'

describe('Media Utilities', () => {
  describe('extractYouTubeId', () => {
    it('should extract ID from standard YouTube URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ')
    })

    it('should extract ID from youtu.be URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ'
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ')
    })

    it('should extract ID from embed URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ')
    })

    it('should extract ID from v URL', () => {
      const url = 'https://www.youtube.com/v/dQw4w9WgXcQ'
      expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ')
    })

    it('should return null for invalid URL', () => {
      const url = 'https://example.com/video'
      expect(extractYouTubeId(url)).toBeNull()
    })
  })

  describe('getYouTubeEmbedUrl', () => {
    it('should convert YouTube URL to embed URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      expect(getYouTubeEmbedUrl(url)).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
    })

    it('should return original URL if no ID found', () => {
      const url = 'https://example.com/video'
      expect(getYouTubeEmbedUrl(url)).toBe(url)
    })
  })

  describe('getSoundCloudEmbedUrl', () => {
    it('should generate SoundCloud embed URL', () => {
      const trackId = '123456789'
      const expected = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/123456789&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true'
      expect(getSoundCloudEmbedUrl(trackId)).toBe(expected)
    })
  })

  describe('isValidMediaUrl', () => {
    it('should validate YouTube URLs', () => {
      expect(isValidMediaUrl('https://youtube.com/watch?v=test', 'youtube')).toBe(true)
      expect(isValidMediaUrl('https://example.com', 'youtube')).toBe(false)
    })

    it('should validate SoundCloud URLs', () => {
      expect(isValidMediaUrl('https://soundcloud.com/track', 'soundcloud')).toBe(true)
      expect(isValidMediaUrl('123456', 'soundcloud')).toBe(true)
      expect(isValidMediaUrl('https://example.com', 'soundcloud')).toBe(false)
    })
  })

  describe('generateSrcSet', () => {
    it('should generate responsive srcSet', () => {
      const baseUrl = 'https://example.com/image.jpg'
      const result = generateSrcSet(baseUrl, [480, 768])

      expect(result).toContain('480w')
      expect(result).toContain('768w')
      expect(result).toContain(`${baseUrl}?w=480`)
      expect(result).toContain(`${baseUrl}?w=768`)
    })

    it('should use default sizes if not provided', () => {
      const baseUrl = 'https://example.com/image.jpg'
      const result = generateSrcSet(baseUrl)

      expect(result).toContain('480w')
      expect(result).toContain('768w')
      expect(result).toContain('1024w')
      expect(result).toContain('1440w')
    })
  })

  describe('createLazyImageLoader', () => {
    let mockObserver: IntersectionObserver
    let mockObserve: jest.Mock
    let mockDisconnect: jest.Mock

    beforeEach(() => {
      mockObserve = jest.fn()
      mockDisconnect = jest.fn()

      mockObserver = {
        observe: mockObserve,
        disconnect: mockDisconnect,
      } as any

      global.IntersectionObserver = jest.fn(() => mockObserver)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should create lazy loader with observe and disconnect methods', () => {
      const loader = createLazyImageLoader()

      expect(typeof loader.observe).toBe('function')
      expect(typeof loader.disconnect).toBe('function')
    })

    it('should observe elements', () => {
      const loader = createLazyImageLoader()
      const mockElement = document.createElement('img')

      loader.observe(mockElement)

      expect(mockObserve).toHaveBeenCalledWith(mockElement)
    })

    it('should disconnect observer', () => {
      const loader = createLazyImageLoader()

      loader.disconnect()

      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('should load image when intersecting', () => {
      const mockElement = document.createElement('img')
      mockElement.dataset.src = 'https://example.com/image.jpg'

      const loader = createLazyImageLoader()

      // Simulate intersection
      const callback = (global.IntersectionObserver as jest.Mock).mock.calls[0][0]
      callback([{ isIntersecting: true, target: mockElement }])

      expect(mockElement.src).toBe('https://example.com/image.jpg')
    })
  })
})
