/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'sbg-navy': '#0B1D3A',
        'sbg-navy-light': '#122B52',
        'sbg-gold': '#C4993B',
        'sbg-gold-light': '#D4AD5A',
        'sbg-blue': '#0078D4',
        'sbg-blue-dark': '#005A9E',
        'sbg-blue-light': '#40A6FF',
        'sbg-sky': '#38BDF8',
        'sbg-emerald': '#10B981',
        'sbg-gray-50': '#F8FAFC',
        'sbg-gray-100': '#F1F5F9',
        'sbg-gray-200': '#E2E8F0',
        'sbg-gray-300': '#CBD5E1',
        'sbg-gray-400': '#94A3B8',
        'sbg-gray-500': '#64748B',
        'sbg-gray-600': '#475569',
        'sbg-gray-700': '#334155',
        'sbg-gray-800': '#1E293B',
        'sbg-gray-900': '#0F172A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['IBM Plex Arabic', 'Noto Kufi Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
