
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        fintech: {
          bg: '#0f172a', // slate-900
          card: '#1e293b', // slate-800
          border: '#334155', // slate-700
          text: '#e2e8f0', // slate-200
          muted: '#94a3b8', // slate-400
          profit: '#10b981', // emerald-500
          profitBg: '#064e3b', // emerald-900
          loss: '#ef4444', // red-500
          lossBg: '#7f1d1d', // red-900
          accent: '#3b82f6', 
        }
      }
    },
  },
  plugins: [],
}
