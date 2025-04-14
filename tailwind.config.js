/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        dash: {
          to: { strokeDashoffset: "-8" },
        },
      },
      animation: {
        dash: "dash 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};
