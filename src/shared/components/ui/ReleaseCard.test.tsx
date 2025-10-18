/**
 * @fileoverview Tests for ReleaseCard component
 * @description Unit tests for the ReleaseCard component
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReleaseCard } from './ReleaseCard'

const mockRelease = {
  id: '1',
  title: 'Test Release',
  date: '2024-01-01',
  coverArt: 'test-cover.jpg',
  spotifyUrl: 'https://spotify.com/track/123',
  soundcloudUrl: 'https://soundcloud.com/track/123',
  youtubeUrl: 'https://youtube.com/watch?v=123',
}

describe('ReleaseCard', () => {
  it('should render release information', () => {
    render(<ReleaseCard release={mockRelease} />)

    expect(screen.getByText('Test Release')).toBeInTheDocument()
    expect(screen.getByText('1/1/2024')).toBeInTheDocument()
  })

  it('should render cover art with proper attributes', () => {
    render(<ReleaseCard release={mockRelease} />)

    const image = screen.getByAltText('Test Release')
    expect(image).toHaveAttribute('src', 'test-cover.jpg')
  })

  it('should handle missing cover art gracefully', () => {
    const releaseWithoutCover = { ...mockRelease, coverArt: undefined }
    render(<ReleaseCard release={releaseWithoutCover} />)

    // Should still render without crashing
    expect(screen.getByText('Test Release')).toBeInTheDocument()
  })

  it('should render streaming platform links', () => {
    render(<ReleaseCard release={mockRelease} />)

    expect(screen.getByText('Spotify')).toBeInTheDocument()
    expect(screen.getByText('SoundCloud')).toBeInTheDocument()
    expect(screen.getByText('YouTube')).toBeInTheDocument()
  })

  it('should make links clickable', async () => {
    const user = userEvent.setup()
    const mockOpen = vi.fn()
    window.open = mockOpen

    render(<ReleaseCard release={mockRelease} />)

    const spotifyLink = screen.getByText('Spotify')
    await user.click(spotifyLink)

    // Should attempt to open link (would be blocked in test environment)
    expect(spotifyLink.closest('a')).toHaveAttribute('href', 'https://spotify.com/track/123')
  })

  it('should handle missing streaming links', () => {
    const releaseWithoutLinks = {
      ...mockRelease,
      spotifyUrl: undefined,
      soundcloudUrl: undefined,
      youtubeUrl: undefined,
    }

    render(<ReleaseCard release={releaseWithoutLinks} />)

    // Should not crash and should still display release info
    expect(screen.getByText('Test Release')).toBeInTheDocument()
    expect(screen.queryByText('Spotify')).not.toBeInTheDocument()
  })

  it('should format dates correctly', () => {
    const releaseWithDifferentDate = { ...mockRelease, date: '2024-12-25' }
    render(<ReleaseCard release={releaseWithDifferentDate} />)

    expect(screen.getByText('12/25/2024')).toBeInTheDocument()
  })
})
