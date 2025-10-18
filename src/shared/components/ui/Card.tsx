import { ReactNode } from 'react'
import { colors, componentColors } from '@/themes'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'neon'
  className?: string
  onClick?: () => void
  hover?: boolean
}

/**
 * Card - Atomic component
 * GRAYSCALE MODE - Sharp technical cards
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
      background: componentColors.card.background,
      border: componentColors.card.border,
      shadow: componentColors.card.shadow,
    },
    elevated: {
      background: componentColors.card.background,
      border: componentColors.card.border,
      shadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    },
    neon: {
      background: colors.brand.primary,
      border: colors.brand.secondary,
      shadow: '0 0 20px rgba(230, 57, 70, 0.3)',
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
        backgroundColor: selectedVariant.background,
        borderColor: selectedVariant.border,
        boxShadow: selectedVariant.shadow,
      }}
    >
      {children}
    </div>
  )
}

export default Card
