import { render, screen } from '@testing-library/react'
import MediaEmbed from './MediaEmbed'

describe('MediaEmbed Component', () => {
  describe('YouTube embeds', () => {
    it('should render YouTube embed with standard URL', () => {
      render(
        <MediaEmbed
          type="youtube"
          src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Test Video"
        />
      )

      const iframe = screen.getByTitle('Test Video')
      expect(iframe).toBeInTheDocument()
      expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ')
    })

    it('should render YouTube embed with embed URL', () => {
      render(
        <MediaEmbed
          type="youtube"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Test Video"
        />
      )

      const iframe = screen.getByTitle('Test Video')
      expect(iframe).toBeInTheDocument()
      expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ')
    })

    it('should render YouTube embed with youtu.be URL', () => {
      render(
        <MediaEmbed
          type="youtube"
          src="https://youtu.be/dQw4w9WgXcQ"
          title="Test Video"
        />
      )

      const iframe = screen.getByTitle('Test Video')
      expect(iframe).toBeInTheDocument()
      expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ')
    })

    it('should apply custom aspect ratio', () => {
      render(
        <MediaEmbed
          type="youtube"
          src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Test Video"
          aspectRatio="4/3"
        />
      )

      const container = screen.getByTitle('Test Video').parentElement
      expect(container).toHaveStyle({ aspectRatio: '4/3' })
    })

    it('should apply custom className', () => {
      render(
        <MediaEmbed
          type="youtube"
          src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Test Video"
          className="custom-class"
        />
      )

      const container = screen.getByTitle('Test Video').parentElement
      expect(container).toHaveClass('custom-class')
    })

    it('should have correct iframe attributes', () => {
      render(
        <MediaEmbed
          type="youtube"
          src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Test Video"
        />
      )

      const iframe = screen.getByTitle('Test Video')
      expect(iframe).toHaveAttribute('frameBorder', '0')
      expect(iframe).toHaveAttribute('allowFullScreen')
      expect(iframe).toHaveAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture')
    })
  })

  describe('SoundCloud embeds', () => {
    it('should render SoundCloud embed', () => {
      render(
        <MediaEmbed
          type="soundcloud"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/123456789"
          title="Test Track"
        />
      )

      const iframe = screen.getByTitle('Test Track')
      expect(iframe).toBeInTheDocument()
      expect(iframe).toHaveAttribute('src', 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/123456789')
    })

    it('should have correct SoundCloud iframe attributes', () => {
      render(
        <MediaEmbed
          type="soundcloud"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/123456789"
          title="Test Track"
        />
      )

      const iframe = screen.getByTitle('Test Track')
      expect(iframe).toHaveAttribute('width', '100%')
      expect(iframe).toHaveAttribute('height', '120')
      expect(iframe).toHaveAttribute('scrolling', 'no')
      expect(iframe).toHaveAttribute('frameBorder', 'no')
      expect(iframe).toHaveAttribute('allow', 'autoplay')
    })

    it('should apply custom className to SoundCloud embed', () => {
      render(
        <MediaEmbed
          type="soundcloud"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/123456789"
          title="Test Track"
          className="soundcloud-custom"
        />
      )

      const container = screen.getByTitle('Test Track').parentElement
      expect(container).toHaveClass('soundcloud-custom')
    })
  })

  describe('Invalid inputs', () => {
    it('should render nothing for invalid YouTube URL', () => {
      const { container } = render(
        <MediaEmbed
          type="youtube"
          src="https://example.com/video"
          title="Invalid Video"
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('should render nothing for unsupported type', () => {
      const { container } = render(
        <MediaEmbed
          type="vimeo" as any
          src="https://vimeo.com/123456"
          title="Unsupported"
        />
      )

      expect(container.firstChild).toBeNull()
    })
  })
})
