/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Suite 52 Color System: Grayscale + Red
      colors: {
        // Atmospheric grayscale
        void: '#000000',
        carbon: '#0a0a0a',
        ash: '#1a1a1a',
        smoke: '#2a2a2a',
        charcoal: '#3a3a3a',
        fog: '#4a4a4a',
        slate: '#6a6a6a',
        silver: '#8a8a8a',
        cloud: '#b4b4b4',
        bone: '#d4d4d4',
        snow: '#ebebeb',
        
        // Red accents
        rust: '#8b2635',
        blood: '#e63946',
        ember: '#ff6b6b',
        flame: '#ff8585',
        blush: '#ffb3b3',

        // Legacy grayscale
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        black: {
          50: '#000000',
          100: '#0a0a0a',
          200: '#141414',
          300: '#1a1a1a',
          400: '#1f1f1f',
          500: '#262626',
          600: '#2e2e2e',
          700: '#3d3d3d',
          800: '#4a4a4a',
          900: '#5a5a5a',
        },
        accent: {
          light: '#ff8585',
          DEFAULT: '#e63946',
          dark: '#8b2635',
        },
      },

      // Font families
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Ubuntu Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
      },

      // Box shadows - Grayscale + Red glows
      boxShadow: {
        'glow-sm': '0 0 10px rgba(255, 255, 255, 0.1)',
        'glow-md': '0 0 20px rgba(255, 255, 255, 0.15)',
        'glow-lg': '0 0 30px rgba(255, 255, 255, 0.2)',
        'glow-red-sm': '0 0 10px rgba(230, 57, 70, 0.3)',
        'glow-red-md': '0 0 20px rgba(230, 57, 70, 0.4)',
        'glow-red-lg': '0 0 30px rgba(230, 57, 70, 0.5)',
        'glow-red-xl': '0 0 50px rgba(230, 57, 70, 0.6)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
        'inner-glow-red': 'inset 0 0 20px rgba(230, 57, 70, 0.1)',
      },

      // Background gradients
      backgroundImage: {
        'gradient-void': 'linear-gradient(to bottom, #000000, #0a0a0a, #000000)',
        'gradient-abyss': 'linear-gradient(to bottom, #000000, #1a1a1a, #000000)',
        'gradient-subtle': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
        'gradient-red': 'linear-gradient(135deg, #8b2635, #e63946)',
        'gradient-red-glow': 'radial-gradient(ellipse at center, rgba(230, 57, 70, 0.3) 0%, transparent 70%)',
        'gradient-mesh': 'radial-gradient(at 20% 30%, rgba(38, 38, 38, 0.2) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(82, 82, 82, 0.1) 0px, transparent 50%)',
        'gradient-portal': 'radial-gradient(ellipse at center, rgba(230, 57, 70, 0.2) 0%, rgba(0, 0, 0, 0) 50%)',
      },

      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },

      // Animation
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-red': 'glowRed 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'portal-pulse': 'portalPulse 4s ease-in-out infinite',
        'particle-drift': 'particleDrift 20s linear infinite',
      },

      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)' },
        },
        glowRed: {
          '0%': { boxShadow: '0 0 10px rgba(230, 57, 70, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(230, 57, 70, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        portalPulse: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        particleDrift: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(10px) translateY(-10px)' },
          '50%': { transform: 'translateX(0) translateY(-20px)' },
          '75%': { transform: 'translateX(-10px) translateY(-10px)' },
          '100%': { transform: 'translateX(0) translateY(0)' },
        },
      },

      // Text shadow for glowing effects
      textShadow: {
        'glow-sm': '0 0 10px rgba(255, 255, 255, 0.3)',
        'glow-md': '0 0 20px rgba(255, 255, 255, 0.4)',
        'glow-red-sm': '0 0 10px rgba(230, 57, 70, 0.5)',
        'glow-red-md': '0 0 20px rgba(230, 57, 70, 0.6)',
        'glow-red-lg': '0 0 30px rgba(230, 57, 70, 0.8)',
      },

      // Custom spacing for 3D layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    // Custom plugin for text-shadow utility
    function({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    },
  ],
}
