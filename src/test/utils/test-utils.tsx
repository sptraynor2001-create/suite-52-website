import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

// Custom render function that includes providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Test helper functions
export const createMockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })
  window.IntersectionObserver = mockIntersectionObserver
  return mockIntersectionObserver
}

export const createMockResizeObserver = () => {
  const mockResizeObserver = vi.fn()
  mockResizeObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })
  window.ResizeObserver = mockResizeObserver
  return mockResizeObserver
}

// Common test data
export const mockLiveSet = {
  id: '1',
  title: 'Test Live Set',
  date: '2024-01-01',
  venue: 'Test Venue',
  city: 'Test City',
  description: 'Test description',
  thumbnail: 'test-thumbnail.jpg',
  duration: '60:00',
  youtubeUrl: 'https://youtube.com/watch?v=test',
  soundcloudUrl: 'https://soundcloud.com/test',
  setlist: ['Track 1', 'Track 2'],
}

export const mockRelease = {
  id: '1',
  title: 'Test Release',
  date: '2024-01-01',
  coverArt: 'test-cover.jpg',
  spotifyUrl: 'https://spotify.com/album/test',
  soundcloudUrl: 'https://soundcloud.com/album/test',
  youtubeUrl: 'https://youtube.com/watch?v=test',
}
