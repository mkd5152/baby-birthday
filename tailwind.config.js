/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2c2322",
        maroon: "#8b0f2f",
        rose: "#ff5b86",
        blush: "#ffd1df",
        parchment: "#fff6ea",
      },
      dropShadow: {
        soft: "0 10px 30px rgba(24, 12, 24, 0.12)",
      },
      fontFamily: {
        cursive: ["'Dancing Script'", "cursive"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
      },
      keyframes: {
        caret: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0 } },
      },
      animation: {
        caret: "caret 1s steps(1) infinite",
      },
    },
  },
  plugins: [],
};