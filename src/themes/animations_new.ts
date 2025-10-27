/**
 * Animation utilities and keyframes
 */

/**
 * CSS Keyframes for common animations
 */
export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,

  slideIn: `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,

  scaleIn: `
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,

  shimmer: `
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
  `,

  typing: `
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }
  `,

  blink: `
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `,
}

/**
 * Animation timing functions
 */
export const timing = {
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  linear: 'linear',

  // Custom curves
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
}

/**
 * Duration presets
 */
export const duration = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms',
}

/**
 * Animation presets
 */
export const animations = {
  fadeIn: {
    animation: `fadeIn ${duration.normal} ${timing.ease}`,
  },

  slideIn: {
    animation: `slideIn ${duration.normal} ${timing.ease}`,
  },

  scaleIn: {
    animation: `scaleIn ${duration.normal} ${timing.bounce}`,
  },

  // For staggered animations
  dropInShow: {
    animation: `slideIn 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
  },

  // Hover effects
  lift: {
    transition: `transform ${duration.fast} ${timing.ease}`,
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },

  glow: {
    transition: `box-shadow ${duration.normal} ${timing.ease}`,
    '&:hover': {
      boxShadow: '0 0 20px rgba(230, 57, 70, 0.3)',
    },
  },

  // Loading states
  pulse: {
    animation: `fadeIn 2s ${timing.ease} infinite alternate`,
  },

  // Typing effect
  typing: {
    overflow: 'hidden',
    borderRight: '2px solid',
    whiteSpace: 'nowrap',
    animation: `typing 3.5s ${timing.ease} forwards, blink 1s infinite`,
  },
}

/**
 * Animation utility functions
 */
export function getAnimationDelay(index: number, baseDelay: number = 100): string {
  return `${index * baseDelay}ms`
}

export function createStaggeredAnimation(
  animationName: keyof typeof animations,
  items: number,
  baseDelay: number = 100
) {
  return Array.from({ length: items }, (_, i) => ({
    ...animations[animationName],
    animationDelay: getAnimationDelay(i, baseDelay),
  }))
}

/**
 * Inject keyframes into document head
 */
export function injectKeyframes() {
  if (typeof document === 'undefined') return

  const styleSheet = document.createElement('style')
  styleSheet.textContent = Object.values(keyframes).join('\n')
  document.head.appendChild(styleSheet)
}

/**
 * Performance-optimized animation checks
 */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Conditional animation based on user preferences
 */
export function safeAnimation(animation: any) {
  return prefersReducedMotion() ? {} : animation
}
