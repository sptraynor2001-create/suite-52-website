/**
 * @fileoverview Tests for card style definitions
 */

import { describe, it, expect } from 'vitest'
import * as cardStyles from './cardStyles'

describe('Card Styles', () => {
  it('should export card style definitions', () => {
    expect(Object.keys(cardStyles).length).toBeGreaterThan(0)
  })
})
