import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-cormorant)', ...fontFamily.serif],
        body: ['var(--font-jost)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      colors: {
        gold: {
          50: '#fdf9ee',
          100: '#f9edcc',
          200: '#f2d88a',
          300: '#e8be4d',
          400: '#dda520',
          500: '#c8891a',
          600: '#a86a14',
          700: '#864e13',
          800: '#6e3e16',
          900: '#5c3418',
        },
        obsidian: '#0a0a0a',
        ivory: '#faf8f4',
        champagne: '#f7f0e3',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c8891a 0%, #e8be4d 50%, #c8891a 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
        'luxury-mesh': 'radial-gradient(ellipse at 20% 50%, rgba(200,137,26,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(232,190,77,0.06) 0%, transparent 50%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
