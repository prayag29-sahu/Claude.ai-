/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#0a0a0a',
        dark: '#111111',
        card: '#161616',
        border: '#222222',
        gold: '#c6a55c',
        'gold-light': '#d4b870',
        cream: '#f0ebe3',
        grey: '#6a6a6a',
        'grey-light': '#999999',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseGold: { '0%,100%': { boxShadow: '0 0 0 0 rgba(198,165,92,0.3)' }, '50%': { boxShadow: '0 0 0 15px rgba(198,165,92,0)' } },
      },
    },
  },
  plugins: [],
}
