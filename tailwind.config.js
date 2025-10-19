/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: "#8b0f2f",
        rose: "#ff6b98",
        parchment: "#fff6ea",
        ink: "#352927"
      },
      fontFamily: {
        cursive: ["'Dancing Script', cursive"],
        body: ["Inter", "ui-sans-serif", "system-ui"]
      }
    },
  },
  plugins: [],
};
