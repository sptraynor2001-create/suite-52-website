/**
 * @fileoverview Tests for utils index exports
 */

import { describe, it, expect } from 'vitest'
import * as utilsExports from './index'

describe('Utils Exports', () => {
  it('should export formatting utilities', () => {
    expect(utilsExports.formatDate).toBeDefined()
    expect(utilsExports.formatDuration).toBeDefined()  
    expect(utilsExports.capitalize).toBeDefined()
  })

  it('should have working utility functions', () => {
    // Test formatDate
    expect(typeof utilsExports.formatDate).toBe('function')
    
    // Test formatDuration  
    expect(typeof utilsExports.formatDuration).toBe('function')
    
    // Test capitalize
    expect(typeof utilsExports.capitalize).toBe('function')
  })
})