/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          primary: '#7A1E2D',
          hover: '#8B1F2F',
        },
        gold: {
          primary: '#F2B84B',
          hover: '#D9A441',
        }
      }
    },
  },
  plugins: [],
}