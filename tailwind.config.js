/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
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

