/**
 * @fileoverview Tests for content exports
 */

import { describe, it, expect } from 'vitest'
import * as contentExports from './index'

describe('Content Exports', () => {
  it('should export page content', () => {
    expect(contentExports.homeContent).toBeDefined()
    expect(contentExports.aboutContent).toBeDefined()
    expect(contentExports.musicContent).toBeDefined()
    expect(contentExports.liveSetsContent).toBeDefined()
    expect(contentExports.showsContent).toBeDefined()
    expect(contentExports.contactContent).toBeDefined()
  })

  it('should export component content', () => {
    expect(contentExports.componentContent).toBeDefined()
  })

  it('should export shared content', () => {
    expect(contentExports.sharedContent).toBeDefined()
  })

  it('should have valid content structure', () => {
    expect(typeof contentExports.homeContent.title).toBe('string')
    expect(typeof contentExports.aboutContent.title).toBe('string')
    expect(typeof contentExports.musicContent.title).toBe('string')
  })
})