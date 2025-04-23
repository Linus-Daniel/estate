/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#3A0CA3",
        secondary: "#7209B7",
        accent: "#F72585",
        success: {
          DEFAULT: "#16a34a", // green-600
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b", // amber-500
          foreground: "#ffffff",
        },
      },

      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
};
