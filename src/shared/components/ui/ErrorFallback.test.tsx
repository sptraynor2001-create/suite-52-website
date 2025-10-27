import { render, screen, fireEvent } from '@testing-library/react'
import ErrorFallback from './ErrorFallback'

describe('ErrorFallback Component', () => {
  it('should render default error message when no error provided', () => {
    render(<ErrorFallback />)

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('should render custom error message', () => {
    render(<ErrorFallback error="Custom error message" />)

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
  })

  it('should render Error object message', () => {
    const error = new Error('Network error')
    render(<ErrorFallback error={error} />)

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  it('should render retry button when onRetry provided', () => {
    const mockOnRetry = jest.fn()
    render(<ErrorFallback onRetry={mockOnRetry} />)

    const retryButton = screen.getByRole('button', { name: /try again/i })
    expect(retryButton).toBeInTheDocument()
  })

  it('should not render retry button when onRetry not provided', () => {
    render(<ErrorFallback />)

    const retryButton = screen.queryByRole('button', { name: /try again/i })
    expect(retryButton).not.toBeInTheDocument()
  })

  it('should call onRetry when retry button is clicked', () => {
    const mockOnRetry = jest.fn()
    render(<ErrorFallback onRetry={mockOnRetry} />)

    const retryButton = screen.getByRole('button', { name: /try again/i })
    fireEvent.click(retryButton)

    expect(mockOnRetry).toHaveBeenCalledTimes(1)
  })

  it('should apply custom className', () => {
    const { container } = render(<ErrorFallback className="custom-error" />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('custom-error')
  })

  it('should render warning emoji', () => {
    render(<ErrorFallback />)

    expect(screen.getByText('⚠️')).toBeInTheDocument()
  })

  it('should apply correct styling to title', () => {
    render(<ErrorFallback />)

    const title = screen.getByRole('heading', { level: 3 })
    expect(title).toHaveClass('mb-2')
  })

  it('should apply correct styling to description', () => {
    render(<ErrorFallback />)

    const description = screen.getByText('Something went wrong')
    expect(description).toHaveClass('mb-6', 'max-w-md')
  })

  it('should have correct wrapper styling', () => {
    const { container } = render(<ErrorFallback />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'p-8',
      'text-center'
    )
  })

  it('should have correct button styling when retry is provided', () => {
    render(<ErrorFallback onRetry={() => {}} />)

    const retryButton = screen.getByRole('button', { name: /try again/i })
    expect(retryButton).toHaveClass('px-4', 'py-2')
  })

  it('should handle various error types', () => {
    const testCases = [
      { error: 'String error', expected: 'String error' },
      { error: new Error('Error object'), expected: 'Error object' },
      { error: { message: 'Object with message' }, expected: 'Object with message' },
      { error: null, expected: 'Something went wrong' },
      { error: undefined, expected: 'Something went wrong' },
      { error: 404, expected: 'Something went wrong' },
    ]

    testCases.forEach(({ error, expected }) => {
      const { unmount } = render(<ErrorFallback error={error} />)
      expect(screen.getByText(expected)).toBeInTheDocument()
      unmount()
    })
  })

  it('should maintain proper semantic structure', () => {
    render(<ErrorFallback onRetry={() => {}} />)

    // Should have proper heading hierarchy
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()

    // Should have button with proper role
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should be accessible', () => {
    render(<ErrorFallback error="Test error" onRetry={() => {}} />)

    // Should have descriptive text
    expect(screen.getByText('Test error')).toBeInTheDocument()

    // Button should be focusable and have descriptive text
    const retryButton = screen.getByRole('button', { name: /try again/i })
    expect(retryButton).toBeInTheDocument()
    expect(retryButton).toHaveAttribute('type', 'button')
  })
})
