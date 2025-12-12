/**
 * Card Styles - Suite 52 Design System
 * Consistent card styling with 3D-ready variants
 */

export const cardStyles = {
  // Base card styles - glass morphism aesthetic
  base: {
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  
  // Hover state
  hover: {
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },

  // Active/pressed state
  active: {
    backgroundColor: 'rgba(42, 42, 42, 0.9)',
    borderColor: 'rgba(230, 57, 70, 0.3)',
    transform: 'translateY(0)',
  },

  // Accent variant (with red glow)
  accent: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    border: '1px solid rgba(230, 57, 70, 0.2)',
    boxShadow: '0 0 20px rgba(230, 57, 70, 0.1)',
  },

  accentHover: {
    borderColor: 'rgba(230, 57, 70, 0.4)',
    boxShadow: '0 0 30px rgba(230, 57, 70, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  
  // Padding options
  padding: {
    none: '0',
    compact: '12px 16px',
    default: '16px 20px',
    spacious: '24px 28px',
    large: '32px 36px',
  },
  
  // Margin/spacing
  margin: {
    none: '0',
    small: '12px',
    bottom: '20px',
    gap: '20px',
    large: '32px',
  },

  // Border radius options
  radius: {
    none: '0',
    small: '4px',
    default: '8px',
    medium: '12px',
    large: '16px',
    full: '9999px',
  },
}

export const cardColors = {
  border: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    default: 'rgba(255, 255, 255, 0.1)',
    hover: 'rgba(255, 255, 255, 0.25)',
    strong: 'rgba(255, 255, 255, 0.3)',
    accent: 'rgba(230, 57, 70, 0.3)',
    accentStrong: 'rgba(230, 57, 70, 0.5)',
  },
  background: {
    transparent: 'transparent',
    subtle: 'rgba(26, 26, 26, 0.3)',
    default: 'rgba(26, 26, 26, 0.6)',
    hover: 'rgba(42, 42, 42, 0.8)',
    solid: 'rgba(26, 26, 26, 0.95)',
    glass: 'rgba(10, 10, 10, 0.7)',
  },
  shadow: {
    none: 'none',
    subtle: '0 2px 10px rgba(0, 0, 0, 0.2)',
    default: '0 4px 20px rgba(0, 0, 0, 0.4)',
    elevated: '0 8px 32px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(255, 255, 255, 0.05)',
    glowRed: '0 0 20px rgba(230, 57, 70, 0.2)',
  },
}

// 3D Card styles for Three.js integration
export const card3DStyles = {
  // Portal frame cards
  portal: {
    ringColor: 0xffffff,
    glowColor: 0xe63946,
    opacity: 0.8,
    emissiveIntensity: 0.3,
  },
  // Floating content cards
  floating: {
    elevation: 0.5,
    rotationSpeed: 0.001,
    hoverElevation: 1.0,
  },
  // Glass material properties
  glass: {
    transmission: 0.9,
    roughness: 0.1,
    thickness: 0.5,
    chromaticAberration: 0.02,
  },
}

export type CardStyle = typeof cardStyles
export type CardColors = typeof cardColors
export type Card3DStyles = typeof card3DStyles
