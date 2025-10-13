/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Color palette - Midnight blue futuristic theme
      colors: {
        midnight: {
          50: '#0a0e1a',
          100: '#0f1420',
          200: '#141a2e',
          300: '#1a2138',
          400: '#1f2843',
          500: '#252f4f',
          600: '#2b365a',
          700: '#323d66',
          800: '#384471',
          900: '#3f4b7d',
        },
        abyss: {
          50: '#000000',
          100: '#010203',
          200: '#020406',
          300: '#030609',
          400: '#04080c',
          500: '#05090e',
          600: '#060b11',
          700: '#070d14',
          800: '#080f17',
          900: '#09111a',
        },
        neon: {
          cyan: '#00f3ff',
          blue: '#0088ff',
          purple: '#8b5cf6',
          pink: '#ec4899',
          green: '#10b981',
        },
      },

      // Font families
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
      },

      // Box shadows with neon glows
      boxShadow: {
        'glow-blue-sm': '0 0 10px rgba(0, 136, 255, 0.5)',
        'glow-blue-md': '0 0 20px rgba(0, 136, 255, 0.6)',
        'glow-blue-lg': '0 0 30px rgba(0, 136, 255, 0.7)',
        'glow-cyan-sm': '0 0 10px rgba(0, 243, 255, 0.5)',
        'glow-cyan-md': '0 0 20px rgba(0, 243, 255, 0.6)',
        'glow-cyan-lg': '0 0 30px rgba(0, 243, 255, 0.7)',
        'glow-purple-sm': '0 0 10px rgba(139, 92, 246, 0.5)',
        'glow-purple-md': '0 0 20px rgba(139, 92, 246, 0.6)',
        'glow-purple-lg': '0 0 30px rgba(139, 92, 246, 0.7)',
      },

      // Background gradients
      backgroundImage: {
        'gradient-midnight': 'linear-gradient(to bottom, #000000, #252f4f, #000000)',
        'gradient-abyss': 'linear-gradient(to bottom, #000000, #05090e, #000000)',
        'gradient-neon-blue': 'linear-gradient(135deg, rgba(0, 136, 255, 0.3), rgba(0, 243, 255, 0.1))',
        'gradient-neon-purple': 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.1))',
        'gradient-mesh': 'radial-gradient(at 20% 30%, rgba(37, 47, 79, 0.3) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(0, 136, 255, 0.15) 0px, transparent 50%), radial-gradient(at 40% 80%, rgba(0, 243, 255, 0.1) 0px, transparent 50%)',
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
          '0%': { boxShadow: '0 0 5px rgba(0, 243, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 243, 255, 0.8)' },
        },
      },

      // Text shadow for glow effects
      textShadow: {
        'glow-blue-sm': '0 0 10px rgba(0, 136, 255, 0.8)',
        'glow-blue-md': '0 0 20px rgba(0, 136, 255, 0.9)',
        'glow-cyan-sm': '0 0 10px rgba(0, 243, 255, 0.8)',
        'glow-cyan-md': '0 0 20px rgba(0, 243, 255, 0.9)',
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
