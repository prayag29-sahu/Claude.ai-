/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT:'#0A1628', 800:'#0D2137', 700:'#0B3D6B' },
        accent:{ DEFAULT:'#00C6FF', dark:'#0072B1' },
        teal: { DEFAULT:'#00A896' },
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'] },
    },
  },
  plugins: [],
};
