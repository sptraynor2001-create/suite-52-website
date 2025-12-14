/**
 * Animation system - Granular animation configurations
 */

export const animations = {
  // Duration presets
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',

    // Custom easing curves
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
  },

  // Animation presets
  presets: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 'duration.normal',
      easing: 'easing.easeOut',
    },

    slideUp: {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
      duration: 'duration.slower',
      easing: 'easing.easeOut',
    },

    scaleIn: {
      from: { opacity: 0, transform: 'scale(0.95)' },
      to: { opacity: 1, transform: 'scale(1)' },
      duration: 'duration.normal',
      easing: 'easing.easeOut',
    },

    slideInLeft: {
      from: { opacity: 0, transform: 'translateX(-20px)' },
      to: { opacity: 1, transform: 'translateX(0)' },
      duration: 'duration.normal',
      easing: 'easing.easeOut',
    },

    slideInRight: {
      from: { opacity: 0, transform: 'translateX(20px)' },
      to: { opacity: 1, transform: 'translateX(0)' },
      duration: 'duration.normal',
      easing: 'easing.easeOut',
    },
  },

  // Page-specific animations
  page: {
    title: {
      delay: 300,
      duration: 'duration.slower',
      easing: 'easing.easeOut',
    },

    content: {
      stagger: 100,
      delay: 1500,
      duration: 'duration.normal',
      easing: 'easing.easeOut',
    },

    background: {
      delay: 0,
      duration: 'duration.slowest',
      easing: 'easing.linear',
      fadeIn: '2s',
    },
  },

  // Home page specific animations
  home: {
    title: {
      typing: {
        startDelay: 800,
        characterDelays: [220, 120, 130, 100, 160, 300, 150, 125],
        cursorBlink: 530,
      },
      fadeDelay: 2800,
    },
    subtitle: {
      transition: 'opacity 2s ease-in 0.8s',
    },
    clickToEnter: {
      transition: 'opacity 1s ease-in 1.5s, transform 1s ease-in 1.5s, font-size 0.3s ease',
    },
    philosophical: {
      startDelay: 3500,
      typingSpeed: { min: 30, max: 80 },
    },
    background: {
      float: {
        duration: '25s',
        reverse: '30s',
      },
    },
  },

  // Component animations
  component: {
    button: {
      hover: {
        scale: 1.05,
        duration: 'duration.fast',
        easing: 'easing.smooth',
      },
      active: {
        scale: 0.95,
        duration: 'duration.instant',
        easing: 'easing.sharp',
      },
    },

    card: {
      hover: {
        y: -4,
        duration: 'duration.normal',
        easing: 'easing.bounce',
      },
    },

    navigation: {
      item: {
        hover: {
          underline: true,
          duration: 'duration.fast',
          easing: 'easing.smooth',
        },
      },
    },
  },

  // Loading animations
  loading: {
    spinner: {
      duration: '1000ms',
      easing: 'easing.linear',
    },

    skeleton: {
      duration: 'duration.slower',
      easing: 'easing.easeInOut',
    },
  },

  // Typing animation settings
  typing: {
    characterDelay: 60,
    cursorBlinkDelay: 530,
    firstCharacterMultiplier: 2.5,
    specialCharacterMultiplier: 2.0,
  },
} as const

// Animation utility functions
export const animationUtils = {
  // Get animation config by name
  getPreset: (name: keyof typeof animations.presets) =>
    animations.presets[name],

  // Create custom animation
  createAnimation: (
    from: Record<string, any>,
    to: Record<string, any>,
    duration = animations.duration.normal,
    easing = animations.easing.easeOut
  ) => ({
    from,
    to,
    duration,
    easing,
  }),

  // Calculate staggered delays
  createStagger: (
    baseDelay: number,
    increment: number,
    count: number
  ) => Array.from({ length: count }, (_, i) => baseDelay + (i * increment)),
} as const
