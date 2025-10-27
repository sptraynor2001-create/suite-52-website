import { render, screen } from '@testing-library/react'
import LiveSetCard from './LiveSetCard'

describe('LiveSetCard Component', () => {
  const defaultProps = {
    title: 'Test Live Set',
    children: <div data-testid="embed-content">Embed Content</div>
  }

  it('should render title and children', () => {
    render(<LiveSetCard {...defaultProps} />)

    expect(screen.getByText('Test Live Set')).toBeInTheDocument()
    expect(screen.getByTestId('embed-content')).toBeInTheDocument()
  })

  it('should render title as h2 element', () => {
    render(<LiveSetCard {...defaultProps} />)

    const titleElement = screen.getByRole('heading', { level: 2 })
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveTextContent('Test Live Set')
  })

  it('should apply correct CSS classes', () => {
    const { container } = render(<LiveSetCard {...defaultProps} />)

    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'py-4', 'sm:py-6', 'px-0')
  })

  it('should apply full width style', () => {
    const { container } = render(<LiveSetCard {...defaultProps} />)

    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveStyle({ width: '100%' })
  })

  it('should render title with correct styling classes', () => {
    render(<LiveSetCard {...defaultProps} />)

    const titleElement = screen.getByText('Test Live Set')
    expect(titleElement).toHaveClass(
      'text-2xl',
      'font-bold',
      'text-gray-900',
      'mb-4',
      'sm:mb-6',
      'text-center',
      'px-4',
      'sm:px-6'
    )
  })

  it('should render children in container with correct padding', () => {
    render(<LiveSetCard {...defaultProps} />)

    const embedContainer = screen.getByTestId('embed-content').parentElement
    expect(embedContainer).toHaveClass('px-4', 'sm:px-6')
  })

  it('should render complex children correctly', () => {
    const complexChildren = (
      <div>
        <iframe
          src="https://www.youtube.com/embed/test"
          title="Test Video"
          data-testid="youtube-iframe"
        />
        <p data-testid="description">Description text</p>
      </div>
    )

    render(<LiveSetCard title="Complex Live Set" children={complexChildren} />)

    expect(screen.getByText('Complex Live Set')).toBeInTheDocument()
    expect(screen.getByTestId('youtube-iframe')).toBeInTheDocument()
    expect(screen.getByTestId('description')).toBeInTheDocument()
  })

  it('should handle empty title', () => {
    render(<LiveSetCard title="" children={<div>Content</div>} />)

    const titleElement = screen.getByRole('heading', { level: 2 })
    expect(titleElement).toHaveTextContent('')
  })

  it('should handle null children', () => {
    render(<LiveSetCard title="Test" children={null} />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    // Should still have the embed container
    const cardElement = screen.getByText('Test').closest('.bg-white')
    expect(cardElement).toBeInTheDocument()
  })

  it('should maintain semantic HTML structure', () => {
    const { container } = render(<LiveSetCard {...defaultProps} />)

    // Should have proper heading hierarchy
    const h2 = container.querySelector('h2')
    expect(h2).toBeInTheDocument()

    // Should have proper container structure
    const cardDiv = container.querySelector('.bg-white')
    expect(cardDiv).toBeInTheDocument()
  })
})
