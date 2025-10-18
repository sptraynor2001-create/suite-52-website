/**
 * Test utilities for consistent testing setup
 */
import { render, RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ReactElement } from 'react'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  route?: string
  withRouter?: boolean
}

// Custom render function with router support
export const renderWithRouter = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialEntries = ['/'], route = '/', withRouter = true, ...renderOptions } = options

  // If component already has router (like App), render directly
  if (!withRouter) {
    return render(ui, renderOptions)
  }

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock navigation function for tests
export const mockNavigate = vi.fn()

// Mock common hooks
export const mockUseNavigate = () => mockNavigate
export const mockUseLocation = (pathname = '/') => ({ 
  pathname,
  search: '',
  hash: '',
  state: null,
  key: 'default'
})

// Re-export everything from testing library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'