/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Instrument_Sans:Medium': ['Instrument Sans', 'sans-serif'],
        'Inter:Regular': ['Inter', 'sans-serif'],
        'IBM_Plex_Mono:Regular': ['IBM Plex Mono', 'monospace'],
        'Inter_Tight:Medium': ['Inter Tight', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

