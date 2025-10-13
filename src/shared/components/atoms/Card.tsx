import { ReactNode } from 'react'
import { colors, gradients } from '@/design'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'neon'
  className?: string
  onClick?: () => void
  hover?: boolean
}

/**
 * Card - Atomic component
 * Futuristic card with midnight gradient background
 */
function Card({ 
  children, 
  variant = 'default', 
  className = '',
  onClick,
  hover = true 
}: CardProps) {
  const variants = {
    default: {
      background: gradients.card.default,
      border: colors.border.default,
      hover: hover ? gradients.card.hover : gradients.card.default,
    },
    elevated: {
      background: gradients.card.elevated,
      border: colors.border.strong,
      hover: hover ? gradients.card.elevated : gradients.card.elevated,
    },
    neon: {
      background: gradients.neon.blue,
      border: colors.border.neon,
      hover: hover ? gradients.neon.cyan : gradients.neon.blue,
    },
  }

  const selectedVariant = variants[variant]

  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl
        backdrop-blur-sm
        border
        transition-all
        duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        backgroundImage: selectedVariant.background,
        borderColor: selectedVariant.border,
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.backgroundImage = selectedVariant.hover
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundImage = selectedVariant.background
      }}
    >
      {children}
    </div>
  )
}

export default Card

