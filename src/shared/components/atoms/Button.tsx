import { ReactNode, ButtonHTMLAttributes } from 'react'
import { colors, gradients, tokens } from '@/design'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

/**
 * Button - Atomic component
 * GRAYSCALE MODE - Sharp, technical buttons
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: {
      background: gradients.button.primary,
      text: colors.text.primary,
      shadow: tokens.shadows.glow.cyan.sm,
      hoverShadow: tokens.shadows.glow.cyan.md,
    },
    secondary: {
      background: gradients.button.secondary,
      text: colors.text.secondary,
      shadow: tokens.shadows.sm,
      hoverShadow: tokens.shadows.md,
    },
    ghost: {
      background: gradients.button.ghost,
      text: colors.text.primary,  // Changed from colors.neon.cyan
      shadow: 'none',
      hoverShadow: tokens.shadows.glow.blue.sm,
    },
    danger: {
      background: gradients.button.danger,
      text: colors.text.primary,
      shadow: tokens.shadows.sm,
      hoverShadow: tokens.shadows.md,
    },
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const selectedVariant = variants[variant]
  const selectedSize = sizes[size]

  return (
    <button
      className={`
        ${selectedSize}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg
        font-semibold
        tracking-wide
        uppercase
        transition-all
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        relative
        overflow-hidden
        ${className}
      `}
      style={{
        backgroundImage: selectedVariant.background,
        color: selectedVariant.text,
        boxShadow: selectedVariant.shadow,
      }}
      disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.boxShadow = selectedVariant.hoverShadow
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = selectedVariant.shadow
        e.currentTarget.style.transform = 'translateY(0)'
      }}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
      
      {/* Hover effect overlay */}
      <span className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity bg-white pointer-events-none" />
    </button>
  )
}

export default Button
