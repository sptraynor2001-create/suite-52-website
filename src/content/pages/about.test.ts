/**
 * @fileoverview Tests for about page content
 */

import { describe, it, expect } from 'vitest'
import { aboutContent } from './about'

describe('About Content', () => {
  it('should have valid about content structure', () => {
    expect(aboutContent.title).toBe('ABOUT')
    expect(aboutContent.codeSnippet).toBeDefined()
    expect(aboutContent.bio).toBeDefined()
  })

  it('should have bio sections', () => {
    expect(aboutContent.bio.intro).toBeDefined()
    expect(aboutContent.bio.description).toBeDefined()
    expect(aboutContent.bio.mission).toBeDefined()
  })

  it('should have content sections', () => {
    expect(aboutContent.sections).toBeDefined()
    expect(aboutContent.sections.artist).toBeDefined()
    expect(aboutContent.sections.philosophy).toBeDefined()
    expect(aboutContent.sections.vision).toBeDefined()
  })
})