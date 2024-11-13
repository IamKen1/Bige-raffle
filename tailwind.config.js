/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: "#FFD700",
        brown: "#8B4513",
        white: "#FFFFFF",
      },
      fontFamily: {
        carnival: ["'Press Start 2P'", "cursive"],
        looney: ["'Looney Tunes'", "cursive"],
      },
    },
  },
  plugins: [],
};
