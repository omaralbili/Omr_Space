/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f2ff",
          100: "#e0e4ff",
          400: "#7c7ff0",
          500: "#5c5ce0",
          600: "#4640c9",
          700: "#3a34a3",
          900: "#221f5e",
        },
        accent: {
          400: "#a970ff",
          500: "#8b3fff",
          600: "#6d1fd8",
        },
      },
      fontFamily: {
        sans: ["Cairo", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
