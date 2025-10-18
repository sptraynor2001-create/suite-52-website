/**
 * @fileoverview Tests for Button component
 * @description Unit tests for the reusable Button component
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('px-4', 'py-2') // Default size classes
    expect(button.style.backgroundColor).toBeTruthy() // Has background color style
  })

  it('should render different variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button')
    expect(button.style.backgroundColor).toBeTruthy()

    rerender(<Button variant="ghost">Ghost</Button>)
    const ghostButton = screen.getByRole('button')
    expect(ghostButton.style.backgroundColor).toBe('transparent')
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be accessible with proper ARIA attributes', () => {
    render(<Button aria-label="Custom label">Button</Button>)

    expect(screen.getByLabelText('Custom label')).toBeInTheDocument()
  })

  it('should support disabled state', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button disabled onClick={handleClick}>Disabled</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()

    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })
})
