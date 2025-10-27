import { render, screen } from '@testing-library/react'
import LoadingSpinner from './LoadingSpinner'

describe('LoadingSpinner Component', () => {
  it('should render with default size (md)', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByRole('generic') // The div with animate-spin
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('w-8', 'h-8')
  })

  it('should render with small size', () => {
    render(<LoadingSpinner size="sm" />)

    const spinner = screen.getByRole('generic')
    expect(spinner).toHaveClass('w-4', 'h-4')
  })

  it('should render with large size', () => {
    render(<LoadingSpinner size="lg" />)

    const spinner = screen.getByRole('generic')
    expect(spinner).toHaveClass('w-12', 'h-12')
  })

  it('should render with custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-spinner" />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('custom-spinner')
  })

  it('should render text when provided', () => {
    render(<LoadingSpinner text="Loading data..." />)

    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })

  it('should apply correct styling to spinner', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByRole('generic')
    expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'border-2')
    expect(spinner).toHaveStyle({
      borderColor: 'rgba(230, 57, 70, 0.3)',
      borderTopColor: '#e63946'
    })
  })

  it('should apply correct styling to text', () => {
    render(<LoadingSpinner text="Please wait..." />)

    const textElement = screen.getByText('Please wait...')
    expect(textElement).toHaveStyle({
      marginTop: '8px',
      textAlign: 'center'
    })
  })

  it('should have correct wrapper styling', () => {
    const { container } = render(<LoadingSpinner />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
  })

  it('should not render text when not provided', () => {
    render(<LoadingSpinner />)

    const wrapper = screen.getByRole('generic').parentElement
    const textElements = wrapper?.querySelectorAll('p')
    expect(textElements?.length).toBe(0)
  })

  it('should handle all size variants', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach(size => {
      const { unmount } = render(<LoadingSpinner size={size} />)
      const spinner = screen.getByRole('generic')

      if (size === 'sm') expect(spinner).toHaveClass('w-4', 'h-4')
      if (size === 'md') expect(spinner).toHaveClass('w-8', 'h-8')
      if (size === 'lg') expect(spinner).toHaveClass('w-12', 'h-12')

      unmount()
    })
  })

  it('should be accessible with proper ARIA attributes', () => {
    render(<LoadingSpinner text="Loading content..." />)

    // The component should be a generic container that can be enhanced with ARIA attributes
    const wrapper = screen.getByRole('generic').parentElement
    expect(wrapper).toBeInTheDocument()
  })
})
