import { ReactNode } from 'react'
import { colors, tokens } from '@/design'

interface GlowTextProps {
  children: ReactNode
  variant?: 'blue' | 'cyan' | 'purple'  // Kept for API consistency
  intensity?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * GlowText - Atomic component
 * GRAYSCALE MODE - Subtle white highlights
 */
function GlowText({ 
  children, 
  variant = 'cyan',  // Ignored in grayscale
  intensity = 'md',
  className = '' 
}: GlowTextProps) {
  // Use white with subtle glow in grayscale mode
  const glowColor = '#ffffff'
  const shadow = tokens.shadows.glow.cyan[intensity]

  return (
    <span
      className={`${className}`}
      style={{
        color: glowColor,
        textShadow: shadow,
      }}
    >
      {children}
    </span>
  )
}

export default GlowText
