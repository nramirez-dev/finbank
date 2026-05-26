/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1B4FD8',
        secondary: '#0EA5E9',
        success: '#22C55E',
        danger: '#EF4444',
        surface: '#F8FAFC',
        'dark-bg': '#0F172A',
        'dark-surface': '#1E293B',
      },
    },
  },
  plugins: [],
};
