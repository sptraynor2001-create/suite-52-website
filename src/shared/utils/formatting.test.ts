/**
 * @fileoverview Tests for formatting utilities
 * @description Unit tests for utility functions
 */

import { describe, it, expect } from 'vitest'
import { formatDate, formatDuration, capitalize } from './formatting'

describe('formatDate', () => {
  it('should format date string correctly', () => {
    const result = formatDate('2024-01-15')
    expect(result).toBe('1/15/2024')
  })

  it('should format Date object correctly', () => {
    const date = new Date('2024-12-25')
    const result = formatDate(date)
    expect(result).toBe('12/25/2024')
  })

  it('should handle different date formats', () => {
    expect(formatDate('2024-03-07')).toBe('3/7/2024')
    expect(formatDate('2024-11-30')).toBe('11/30/2024')
  })
})

describe('formatDuration', () => {
  it('should format seconds to MM:SS', () => {
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(125)).toBe('2:05')
  })

  it('should pad single digit seconds', () => {
    expect(formatDuration(5)).toBe('0:05')
    expect(formatDuration(90)).toBe('1:30')
  })

  it('should handle zero seconds', () => {
    expect(formatDuration(0)).toBe('0:00')
  })

  it('should handle large durations', () => {
    expect(formatDuration(3661)).toBe('61:01') // Over 1 hour
  })
})

describe('capitalize', () => {
  it('should capitalize first letter of each word', () => {
    expect(capitalize('hello world')).toBe('Hello World')
    expect(capitalize('test case')).toBe('Test Case')
  })

  it('should handle single word', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('')
  })

  it('should handle already capitalized words', () => {
    expect(capitalize('Hello World')).toBe('Hello World')
  })

  it('should handle mixed case', () => {
    expect(capitalize('hELLO wORLD')).toBe('Hello World')
  })
})
