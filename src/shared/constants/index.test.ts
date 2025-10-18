/**
 * @fileoverview Tests for application constants
 * @description Unit tests for constant validation
 */

import { describe, it, expect } from 'vitest'
import { ANIMATION_DURATIONS, Z_INDEX, BREAKPOINTS, ROUTES, API_ENDPOINTS } from './index'

describe('ANIMATION_DURATIONS', () => {
  it('should have valid duration values', () => {
    expect(ANIMATION_DURATIONS.fast).toBeGreaterThan(0)
    expect(ANIMATION_DURATIONS.normal).toBeGreaterThan(ANIMATION_DURATIONS.fast)
    expect(ANIMATION_DURATIONS.slow).toBeGreaterThan(ANIMATION_DURATIONS.normal)
  })

  it('should be reasonable duration values', () => {
    Object.values(ANIMATION_DURATIONS).forEach(duration => {
      expect(duration).toBeGreaterThan(0)
      expect(duration).toBeLessThan(10) // No extremely long animations
    })
  })
})

describe('Z_INDEX', () => {
  it('should have logical z-index hierarchy', () => {
    expect(Z_INDEX.background).toBeLessThan(Z_INDEX.content)
    expect(Z_INDEX.content).toBeLessThan(Z_INDEX.navigation)
    expect(Z_INDEX.navigation).toBeLessThan(Z_INDEX.modal)
    expect(Z_INDEX.modal).toBeLessThan(Z_INDEX.tooltip)
  })

  it('should use reasonable z-index values', () => {
    Object.values(Z_INDEX).forEach(zIndex => {
      expect(zIndex).toBeGreaterThanOrEqual(-1)
      expect(zIndex).toBeLessThan(10000)
    })
  })
})

describe('BREAKPOINTS', () => {
  it('should have logical breakpoint progression', () => {
    expect(BREAKPOINTS.sm).toBeLessThan(BREAKPOINTS.md)
    expect(BREAKPOINTS.md).toBeLessThan(BREAKPOINTS.lg)
    expect(BREAKPOINTS.lg).toBeLessThan(BREAKPOINTS.xl)
  })

  it('should use standard breakpoint values', () => {
    expect(BREAKPOINTS.sm).toBe(640)  // Standard sm breakpoint
    expect(BREAKPOINTS.md).toBe(768)  // Standard md breakpoint
    expect(BREAKPOINTS.lg).toBe(1024) // Standard lg breakpoint
    expect(BREAKPOINTS.xl).toBe(1280) // Standard xl breakpoint
  })
})

describe('ROUTES', () => {
  it('should have all expected route keys', () => {
    const expectedRoutes = ['home', 'about', 'music', 'shows', 'contact', 'live-sets']

    expectedRoutes.forEach(route => {
      expect(ROUTES).toHaveProperty(route as keyof typeof ROUTES)
    })
  })

  it('should have valid route path formats', () => {
    Object.values(ROUTES).forEach(route => {
      expect(route).toMatch(/^\/[a-z-]*$/) // Should start with / and contain valid characters
    })
  })

  it('should have home route as root', () => {
    expect(ROUTES.home).toBe('/')
  })
})

describe('API_ENDPOINTS', () => {
  it('should have valid API endpoint formats', () => {
    Object.values(API_ENDPOINTS).forEach(endpoint => {
      expect(endpoint).toMatch(/^\/api\//) // Should start with /api/
    })
  })

  it('should have all expected API endpoints', () => {
    const expectedEndpoints = ['shows', 'music', 'contact']

    expectedEndpoints.forEach(endpoint => {
      expect(API_ENDPOINTS).toHaveProperty(endpoint as keyof typeof API_ENDPOINTS)
    })
  })
})
