/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warmind-red': '#FF3333',
        'warmind-dark': '#0a0a0a',
        'warmind-dim': '#4a1a1a',
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'], // We will import this font
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

