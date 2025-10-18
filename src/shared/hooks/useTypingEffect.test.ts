/**
 * @fileoverview Tests for useTypingEffect hook
 * @description Unit tests for the typing animation hook
 */

import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useTypingEffect } from './useTypingEffect'

describe('useTypingEffect', () => {
  describe('Basic Functionality', () => {
    it('should initialize with empty displayText and hidden cursor', () => {
      const { result } = renderHook(() => useTypingEffect('Hello'))

      expect(result.current.displayText).toBe('')
      expect(result.current.showCursor).toBe(false)
    })

    it('should accept text and delay parameters', () => {
      const { result } = renderHook(() => useTypingEffect('Test Text', 500))

      expect(result.current.displayText).toBe('')
      expect(result.current.showCursor).toBe(false)
    })
  })

  describe('Return Values', () => {
    it('should return displayText and showCursor', () => {
      const { result } = renderHook(() => useTypingEffect('Hi'))

      expect(result.current).toHaveProperty('displayText')
      expect(result.current).toHaveProperty('showCursor')
      expect(typeof result.current.displayText).toBe('string')
      expect(typeof result.current.showCursor).toBe('boolean')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty text', () => {
      const { result } = renderHook(() => useTypingEffect('', 0))

      expect(result.current.displayText).toBe('')
      expect(result.current.showCursor).toBe(false)
    })

    it('should handle zero delay', () => {
      const { result } = renderHook(() => useTypingEffect('Hi', 0))

      expect(result.current.displayText).toBe('')
      expect(result.current.showCursor).toBe(false)
    })
  })

  describe('Performance', () => {
    it('should not cause memory leaks', () => {
      const { unmount } = renderHook(() => useTypingEffect('Test'))

      // Should not throw when unmounted
      expect(() => unmount()).not.toThrow()
    })

    it('should cleanup intervals on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

      const { unmount } = renderHook(() => useTypingEffect('Test'))

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
      expect(clearTimeoutSpy).toHaveBeenCalled()
    })
  })
})
