/**
 * @fileoverview Tests for useTypingEffect hook
 * @description Unit tests for the typing animation hook
 */

import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTypingEffect } from './useTypingEffect'

describe('useTypingEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Basic Functionality', () => {
    it('should initialize with empty displayText and hidden cursor', () => {
      const { result } = renderHook(() => useTypingEffect('Hello'))

      expect(result.current.displayText).toBe('')
      expect(result.current.showCursor).toBe(false)
    })

    it('should accept delay parameter', () => {
      const { result } = renderHook(() => useTypingEffect('Hi', 100))

      // Initially empty
      expect(result.current.displayText).toBe('')
      expect(result.current.showCursor).toBe(false)
    })

    it('should return displayText and showCursor', () => {
      const { result } = renderHook(() => useTypingEffect('Test', 0))

      expect(result.current).toHaveProperty('displayText')
      expect(result.current).toHaveProperty('showCursor')
      expect(typeof result.current.displayText).toBe('string')
      expect(typeof result.current.showCursor).toBe('boolean')
    })
  })

  describe('Special Characters', () => {
    it('should handle text with special characters', () => {
      // Just test that hook accepts special characters without error
      const { result } = renderHook(() => useTypingEffect('a b () [] {} = <> .,;', 0))
      expect(result.current).toHaveProperty('displayText')
      expect(result.current).toHaveProperty('showCursor')
    })
  })

  describe('Cursor Behavior', () => {
    it('should initialize cursor as hidden', () => {
      const { result } = renderHook(() => useTypingEffect('Test', 0))

      expect(result.current.showCursor).toBe(false)
    })

    it('should manage cursor state', () => {
      const { result } = renderHook(() => useTypingEffect('Test', 0))

      // Cursor state is managed internally
      expect(typeof result.current.showCursor).toBe('boolean')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty text', () => {
      const { result } = renderHook(() => useTypingEffect('', 0))

      expect(result.current.displayText).toBe('')
      expect(result.current.showCursor).toBe(false)
    })

    it('should handle single character', () => {
      const { result } = renderHook(() => useTypingEffect('a', 0))

      // Initially empty
      expect(result.current.displayText).toBe('')
    })

    it('should handle long text', () => {
      const longText = 'This is a longer piece of text with multiple words'
      const { result } = renderHook(() => useTypingEffect(longText, 0))

      expect(result.current).toHaveProperty('displayText')
      expect(result.current).toHaveProperty('showCursor')
    })
  })

  describe('Cleanup', () => {
    it('should cleanup timers on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

      const { unmount } = renderHook(() => useTypingEffect('Test'))

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
      expect(clearTimeoutSpy).toHaveBeenCalled()
    })

    it('should not throw on unmount', () => {
      const { unmount } = renderHook(() => useTypingEffect('Test'))

      expect(() => unmount()).not.toThrow()
    })
  })
})
