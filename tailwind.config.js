/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Grayscale palette for development
      colors: {
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
          light: '#e5e5e5',
          medium: '#a3a3a3',
          dark: '#525252',
        },
      },

      // Font families
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
      },

      // Box shadows - Grayscale
      boxShadow: {
        'glow-sm': '0 0 10px rgba(255, 255, 255, 0.1)',
        'glow-md': '0 0 20px rgba(255, 255, 255, 0.15)',
        'glow-lg': '0 0 30px rgba(255, 255, 255, 0.2)',
      },

      // Background gradients - Grayscale
      backgroundImage: {
        'gradient-midnight': 'linear-gradient(to bottom, #000000, #262626, #000000)',
        'gradient-abyss': 'linear-gradient(to bottom, #000000, #0a0a0a, #000000)',
        'gradient-subtle': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'gradient-mesh': 'radial-gradient(at 20% 30%, rgba(38, 38, 38, 0.2) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(82, 82, 82, 0.1) 0px, transparent 50%), radial-gradient(at 40% 80%, rgba(163, 163, 163, 0.05) 0px, transparent 50%)',
      },

      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },

      // Animation
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },

      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)' },
        },
      },

      // Text shadow for subtle highlights
      textShadow: {
        'glow-sm': '0 0 10px rgba(255, 255, 255, 0.3)',
        'glow-md': '0 0 20px rgba(255, 255, 255, 0.4)',
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

/* 
 * COLOR PALETTE (PRESERVED FOR RESTORATION)
 * 
 * midnight: { 50-900 scale }
 * abyss: { 50-900 scale }
 * neon: { cyan, blue, purple, pink, green }
 * 
 * boxShadow: { glow-cyan-sm, glow-blue-md, etc. }
 * backgroundImage: { gradient-neon-blue, etc. }
 */
