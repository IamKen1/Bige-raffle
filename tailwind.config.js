/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: "#FFD700",
        brown: "#8B4513",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ["'Poppins'", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
        carnival: ["'Carnival'", "cursive"],
        cooper: ["'Cooper Std'", "serif"],
      },
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      screens: {
        '4k': '4800px',
      },
    },
  },
  plugins: [],
}
