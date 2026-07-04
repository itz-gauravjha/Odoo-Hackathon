/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: '#0b0f19',
        'midnight-card': 'rgba(17, 24, 39, 0.65)',
        'midnight-card-hover': 'rgba(31, 41, 55, 0.8)',
        'color-present': '#10b981',
        'color-absent': '#ef4444',
        'color-halfday': '#f59e0b',
        'color-leave': '#8b5cf6',
        'color-pending': '#3b82f6',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.15)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.15)',
      }
    },
  },
  plugins: [],
}
