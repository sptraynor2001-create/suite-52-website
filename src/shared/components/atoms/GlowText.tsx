import { ReactNode } from 'react'
import { colors, tokens } from '@/design'

interface GlowTextProps {
  children: ReactNode
  variant?: 'blue' | 'cyan' | 'purple'
  intensity?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * GlowText - Atomic component
 * Text with neon glow effect
 */
function GlowText({ 
  children, 
  variant = 'cyan', 
  intensity = 'md',
  className = '' 
}: GlowTextProps) {
  const glowColors = {
    blue: colors.neon.blue,
    cyan: colors.neon.cyan,
    purple: colors.neon.purple,
  }

  const shadows = {
    blue: tokens.shadows.glow.blue,
    cyan: tokens.shadows.glow.cyan,
    purple: tokens.shadows.glow.purple,
  }

  return (
    <span
      className={`${className}`}
      style={{
        color: glowColors[variant],
        textShadow: shadows[variant][intensity],
      }}
    >
      {children}
    </span>
  )
}

export default GlowText

