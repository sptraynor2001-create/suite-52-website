/**
 * Particle System Configuration
 * Centralized configuration for all particle systems across the application
 */

export const particleConfig = {
  // Main whirlpool particles
  whirlpool: {
    counts: {
      desktop: 1400,
      mobile: 600,
    },
    trailCounts: {
      desktop: 500,
      mobile: 150,
    },
    sizes: {
      min: 0.03,
      max: 0.09,
      mainMin: 0.03,
      mainMax: 0.04,
    },
    speeds: {
      min: 0.008,
      max: 0.015,
    },
    opacities: {
      particles: 0.12,
      trails: 0.11,
    },
    glitch: {
      chance: { min: 0.15, max: 0.30 },
      rates: { min: 0.002, max: 0.004 },
      offsets: { min: 0.06, max: 0.10 },
    },
  },

  // Accent particles (red)
  accent: {
    counts: {
      desktop: 8,
      mobile: 4,
    },
    trailCounts: {
      desktop: 10,
      mobile: 5,
    },
    sizes: {
      min: 0.03,
      max: 0.09,
      material: { mobile: 0.045, desktop: 0.05 },
    },
    speeds: {
      min: 0.008,
      max: 0.015,
    },
    opacities: {
      particles: 0.15,
      trails: 0.13,
    },
    glitch: {
      chance: { min: 0.2, max: 0.35 },
      rates: { min: 0.002, max: 0.005 },
      offsets: { min: 0.08, max: 0.12 },
    },
  },

  // Blue accent particles
  blueAccent: {
    count: 4,
    trailCount: 5,
    sizes: {
      min: 0.03,
      max: 0.09,
      material: 0.05,
    },
    speeds: {
      min: 0.008,
      max: 0.015,
    },
    opacities: {
      particles: 0.15,
      trails: 0.13,
    },
  },

  // Green accent particles
  greenAccent: {
    count: 4,
    trailCount: 5,
    sizes: {
      min: 0.03,
      max: 0.09,
      material: 0.05,
    },
    speeds: {
      min: 0.008,
      max: 0.015,
    },
    opacities: {
      particles: 0.15,
      trails: 0.13,
    },
  },

  // Gold accent particles
  goldAccent: {
    count: 4,
    trailCount: 5,
    trailsPerGlitch: 5,
    sizes: {
      min: 0.03,
      max: 0.09,
      material: 0.05,
    },
    speeds: {
      min: 0.008,
      max: 0.015,
    },
    opacities: {
      particles: 0.15,
      trails: 0.13,
    },
    glitch: {
      chance: { min: 0.2, max: 0.35 },
      rates: { min: 0.002, max: 0.005 },
      offsets: { min: 0.08, max: 0.12 },
    },
  },

  // Animation settings
  animation: {
    fadeDuration: 2.5,
    cycleLength: {
      main: 100,
      accent: 110,
    },
    trailAge: 0.15,
    mobileFrameSkip: 2,
  },

  // Mouse interaction multipliers
  mouseInteraction: {
    opacity: {
      min: 0.7,
      max: 1.0,
      range: 0.15,
    },
    pull: {
      base: 1.0,
      range: 0.05,
    },
    rotation: {
      base: 1.0,
      range: 0.08,
    },
    // For accent particles (blue, green, gold)
    accentOpacity: {
      min: 0.15,
      max: 0.575,
      range: 0.425,
    },
    accentPull: {
      base: 1.0,
      range: 0.3,
    },
  },

  // Particle Constellation Globe
  constellationGlobe: {
    baseParticles: {
      desktop: 4000,
      mobile: 2000,
    },
    constellationParticles: {
      desktop: 25,
      mobile: 15,
    },
    waveInterval: 3.5, // seconds
    waveSpeed: 0.8,
    continentAttraction: {
      base: 0.3,
      hover: 1.2,
    },
    rotationSpeed: 0.001,
  },
} as const

