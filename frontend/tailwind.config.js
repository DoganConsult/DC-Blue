/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9',
        'brand-dark': '#0A3C6B',
        'brand-darker': '#062847',
        'saudi-green': '#006C35',
        gold: '#E3B76B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['IBM Plex Arabic', 'Noto Kufi Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
