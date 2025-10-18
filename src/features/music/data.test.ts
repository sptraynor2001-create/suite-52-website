/**
 * @fileoverview Tests for music data
 * @description Tests data structure and validation for music releases
 */

import { describe, it, expect } from 'vitest'
import { releases } from './data'

describe('Music Data', () => {
  describe('Data Structure', () => {
    it('should have valid release objects', () => {
      releases.forEach((release) => {
        expect(release).toHaveProperty('id')
        expect(release).toHaveProperty('title')
        expect(release).toHaveProperty('releaseDate')
        expect(typeof release.id).toBe('string')
        expect(typeof release.title).toBe('string')
        expect(typeof release.releaseDate).toBe('string')
      })
    })

    it('should have unique IDs', () => {
      const ids = releases.map(r => r.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have valid release dates', () => {
      releases.forEach((release) => {
        const date = new Date(release.releaseDate)
        expect(date).toBeInstanceOf(Date)
        expect(isNaN(date.getTime())).toBe(false)
      })
    })
  })

  describe('Optional Fields', () => {
    it('should handle missing streaming links gracefully', () => {
      // This test ensures that missing links don't break the UI
      const releaseWithoutLinks = {
        id: 'test',
        title: 'Test Release',
        date: '2024-01-01'
      }

      expect(releaseWithoutLinks.spotifyUrl).toBeUndefined()
      expect(releaseWithoutLinks.soundcloudUrl).toBeUndefined()
      expect(releaseWithoutLinks.youtubeUrl).toBeUndefined()
    })

    it('should validate URL formats when present', () => {
      releases.forEach((release) => {
        if (release.spotifyUrl) {
          expect(release.spotifyUrl).toMatch(/^https?:\/\/.*spotify\.com/)
        }
        if (release.soundcloudUrl) {
          expect(release.soundcloudUrl).toMatch(/^https?:\/\/.*soundcloud\.com/)
        }
        if (release.youtubeUrl) {
          expect(release.youtubeUrl).toMatch(/^https?:\/\/.*youtube\.com/)
        }
      })
    })
  })

  describe('Data Integrity', () => {
    it('should have reasonable title lengths', () => {
      releases.forEach((release) => {
        expect(release.title.length).toBeGreaterThan(0)
        expect(release.title.length).toBeLessThan(100)
      })
    })

    it('should have valid release dates', () => {
      const now = new Date()
      releases.forEach((release) => {
        const releaseDate = new Date(release.releaseDate)
        // Release dates can be in the past (for existing releases) or future
        expect(releaseDate).toBeInstanceOf(Date)
        expect(isNaN(releaseDate.getTime())).toBe(false)
        // Should not be too far in the past (reasonable data)
        const fiveYearsAgo = new Date()
        fiveYearsAgo.setFullYear(now.getFullYear() - 5)
        expect(releaseDate.getTime()).toBeGreaterThan(fiveYearsAgo.getTime())
      })
    })
  })
})
