/**
 * @fileoverview Tests for EPK (Electronic Press Kit) component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EPK from './EPK'

describe('EPK', () => {
  it('should render EPK title', () => {
    render(<EPK />)

    expect(screen.getByText('ELECTRONIC_PRESS_KIT')).toBeInTheDocument()
  })

  it('should render press kit description', () => {
    render(<EPK />)

    expect(screen.getByText(/Electronic Press Kit/i)).toBeInTheDocument()
  })

  it('should render bio section', () => {
    render(<EPK />)

    expect(screen.getByText('Bio')).toBeInTheDocument()
  })

  it('should render press photos section', () => {
    render(<EPK />)

    expect(screen.getByText('Press Photos')).toBeInTheDocument()
    expect(screen.getByText('Press Photo 1')).toBeInTheDocument()
    expect(screen.getByText('Press Photo 2')).toBeInTheDocument()
  })

  it('should render stats and achievements section', () => {
    render(<EPK />)

    expect(screen.getByText('Stats & Achievements')).toBeInTheDocument()
  })

  it('should render contact information section', () => {
    render(<EPK />)

    expect(screen.getByText('Contact')).toBeInTheDocument()
  })
})
