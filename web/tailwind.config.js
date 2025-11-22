/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // dark mode toggled by adding 'dark' class to <html>
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb", // blue-600
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      borderRadius: {
        xl: "16px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2,6,23,.06)",
      },
    },
  },
  plugins: [],
};
