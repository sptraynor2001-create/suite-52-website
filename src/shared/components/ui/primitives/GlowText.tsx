import { ReactNode } from 'react'

interface GlowTextProps {
  children: ReactNode
  variant?: 'blue' | 'cyan' | 'purple'  // Kept for API consistency
  intensity?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * GlowText - Atomic component
 * GRAYSCALE MODE - No glow, just clean white text
 */
function GlowText({ 
  children, 
  className = '' 
}: GlowTextProps) {
  return (
    <span
      className={`${className}`}
      style={{
        color: '#ffffff',
      }}
    >
      {children}
    </span>
  )
}

export default GlowText
