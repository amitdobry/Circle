/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        dash: {
          to: { strokeDashoffset: "-8" },
        },
        glow: {
          "0%": { boxShadow: "0 0 0px rgba(16, 185, 129, 0)" },
          "100%": { boxShadow: "0 0 14px rgba(16, 185, 129, 0.9)" },
        },
      },
      fadeout: {
        "0%": { opacity: "0" },
        "10%": { opacity: "1" },
        "90%": { opacity: "1" },
        "100%": { opacity: "0" },
      },
      animation: {
        dash: "dash 1.5s linear infinite",
        glow: "glow 0.8s ease-out",
        fadeout: "fadeout 2s ease-in-out forwards", // 👈 ADD THIS
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
